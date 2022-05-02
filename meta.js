import { crocks, HyperErr, PouchDB, R } from "./deps.js";

import { asyncIs, isDefined, isNotEqual } from "./utils.js";

const { Async } = crocks;
const { identity, tap, map } = R;

const metaDbName = "meta-cl1ld3td500003e68rc2f8o6x";

export const PouchDbAdapterTypes = {
  idb: "idb",
  indexeddb: "indexeddb",
  memory: "memory",
};

export const createPouch = (name, options) => {
  const _options = { ...options };
  // always end with trailing slash (see prefix in https://github.com/aaronhuggins/pouchdb_deno#indexeddb)
  if (_options.prefix && _options.prefix.slice(-1) !== "/") {
    _options.prefix = `${_options.prefix}/`;
  }

  return new PouchDB.defaults(_options)(name);
};

const asyncifyDb = (db) => {
  return ({
    get: Async.fromPromise(db.get.bind(db)),
    put: Async.fromPromise(db.put.bind(db)),
    post: Async.fromPromise(db.post.bind(db)),
    find: Async.fromPromise(db.find.bind(db)),
    remove: Async.fromPromise(db.remove.bind(db)),
    createIndex: Async.fromPromise(db.createIndex.bind(db)),
    close: Async.fromPromise(db.close.bind(db)),
    destroy: Async.fromPromise(db.destroy.bind(db)),
    allDocs: Async.fromPromise(db.allDocs.bind(db)),
    bulkDocs: Async.fromPromise(db.bulkDocs.bind(db)),
    getIndexes: Async.fromPromise(db.getIndexes.bind(db)),
  });
};

export const MetaDb = ({ adapter, prefix }) => {
  const metaDb = asyncifyDb(
    createPouch(metaDbName, { adapter, prefix, systemPath: prefix }),
  );
  const dbs = new Map();
  let loaded = false;

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
            identity,
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
          // destroy the underlying storage, and remove from dbs Map
          .chain(() =>
            get(name).chain((db) => db.destroy())
              .map(() => dbs.delete(name))
          )
      )
      .map(() => name);
  };

  const down = () => {
    // Close all connections to databases
    return Async.all(
      Array.from(dbs.keys).map((name) => get(name).chain((db) => db.close())),
    ).chain(() => metaDb.close());
  };

  return {
    get,
    create,
    remove,
    down,
  };
};
