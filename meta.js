import { crocks, HyperErr, PouchDB, R } from "./deps.js";

import { asyncIs, isDefined, isNotEqual } from "./utils.js";

const { Async } = crocks;
const { identity, tap, map } = R;

const metaDbName = "cl1ld3td500003e68rc2f8o6x";

export const PouchDbAdapterTypes = {
  idb: "idb",
  memory: "memory",
};

const createPouch = (name, options) => new PouchDB.defaults(options)(name);

const asyncifyDb = (db) => {
  return ({
    get: Async.fromPromise(db.get.bind(db)),
    put: Async.fromPromise(db.put.bind(db)),
    post: Async.fromPromise(db.post.bind(db)),
    find: Async.fromPromise(db.find.bind(db)),
    remove: Async.fromPromise(db.remove.bind(db)),
    createIndex: Async.fromPromise(db.createIndex.bind(db)),
    close: Async.fromPromise(db.close.bind(db)),
    allDocs: Async.fromPromise(db.allDocs.bind(db)),
    bulkDocs: Async.fromPromise(db.bulkDocs.bind(db)),
  });
};

export const MetaDb = ({ adapter, prefix }) => {
  const metaDb = asyncifyDb(createPouch(metaDbName, { adapter, prefix }));
  const dbs = new Map();
  let loaded = false;

  const _close = (name) => {
    return get(name).chain((db) => db.close());
  };

  /**
   * Open connections to each persisted database
   * and add a reference in the local dbs Map
   */
  const _load = () => {
    if (loaded) {
      return Async.Resolved();
    }

    return metaDb.find({
      selector: { type: "database" },
      limit: Number.MAX_SAFE_INTEGER,
    }).map((res) => res.docs)
      .map(tap(console.log))
      .map(map(
        ({ name }) => {
          dbs.set(name, createPouch(name, { adapter, prefix }));
          return name;
        },
      ))
      .bimap(
        (e) => console.log("ERROR: ", e.message),
        (names) =>
          console.log(
            `{ INFO: loaded databases: [${names.join(", ")}], DATE: ${
              new Date().toISOString()
            } }`,
          ),
      )
      .map(tap(() => loaded = true));
  };

  const get = (name) => {
    return _load()
      .chain(() => Async.of(name))
      .chain(asyncIs(isNotEqual(metaDbName)))
      .bimap(
        () => HyperErr({ status: 422, msg: `${name} is a reserved db name.` }),
        identity,
      )
      .chain(() =>
        Async.of(dbs.get(name))
          .chain(asyncIs(isDefined))
          .bimap(
            () => HyperErr({ status: 404, msg: `database does not exist` }),
            identity
          )
      )
      .map(asyncifyDb);
  };

  const create = (name) => {
    return get(name)
      .bichain(
        // map DNE to creating a DB
        () =>
          Async.of()
            .chain(() =>
              metaDb.post({
                name,
                type: "database",
                createdAt: new Date().toISOString(),
              })
            )
            .map(() =>
              dbs
                .set(name, createPouch(name, { adapter, prefix }))
                .get(name)
            ),
        // DB was found, so error
        () =>
          Async.Rejected(
            HyperErr({ status: 409, msg: `database already exists` }),
          ),
      );
  };

  const remove = (name) => {
    return get(name)
      .chain(() =>
        metaDb.find({
          selector: { name },
        })
          .map((res) => res.docs.pop())
          .chain(asyncIs(isDefined))
          // remove tracking doc from metaDb
          .chain((doc) => metaDb.remove(doc))
          .chain(() =>
            // Close the connection to underlying storage, and remove from dbs Map
            _close(name)
              .map(() => dbs.delete(name))
          )
      )
      .map(() => name);
  };

  const down = () => {
    return Async.all(
      Array.from(dbs.keys).map(_close),
    ).chain(() => metaDb.close());
  };

  return {
    get,
    create,
    remove,
    down,
  };
};
