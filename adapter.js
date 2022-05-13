import { bulk } from "./bulk.js";
import { crocks, HyperErr, R } from "./deps.js";

import { foldDocs, handleHyperErr, lowerCaseValue } from "./utils.js";

const { Async } = crocks;

const { always, omit, isEmpty, identity, pluck, mergeRight, prop } = R;

/**
 * @typedef {Object} CreateDocumentArgs
 * @property {string} db
 * @property {string} id
 * @property {object} doc
 *
 * @typedef {Object} RetrieveDocumentArgs
 * @property {string} db
 * @property {string} id
 *
 * @typedef {Object} QueryDocumentsArgs
 * @property {string} db
 * @property {QueryArgs} query
 *
 * @typedef {Object} QueryArgs
 * @property {object} selector
 * @property {string[]} fields
 * @property {number} limit
 * @property {object[]} sort
 * @property {string} use_index
 *
 * @typedef {Object} IndexDocumentArgs
 * @property {string} db
 * @property {string} name
 * @property {string[]} fields
 *
 * @typedef {Object} ListDocumentArgs
 * @property {string} db
 * @property {number} limit
 * @property {string} startkey
 * @property {string} endkey
 * @property {string[]} keys
 *
 * @typedef {Object} BulkDocumentsArgs
 * @property {string} db
 * @property {object[]} docs
 *
 * @typedef {Object} Response
 * @property {boolean} ok
 */

export default function ({ db: metaDb }) {
  /**
   * @param {string} name
   * @returns {Promise<Response>}
   */
  function createDatabase(name) {
    return metaDb.create(name)
      .map(always({ ok: true }))
      .bichain(
        handleHyperErr,
        Async.Resolved,
      )
      .toPromise();
  }

  /**
   * @param {string} name
   * @returns {Promise<Response>}
   */
  function removeDatabase(name) {
    return metaDb.remove(name)
      .map(always({ ok: true }))
      .bichain(
        handleHyperErr,
        Async.Resolved,
      )
      .toPromise();
  }

  /**
   * @param {CreateDocumentArgs}
   * @returns {Promise<Response>}
   */
  function createDocument({ db, id, doc }) {
    return Async.of(doc)
      .chain((doc) =>
        isEmpty(doc)
          ? Async.Rejected(HyperErr({ status: 400, msg: "document empty" }))
          : Async.Resolved(doc)
      )
      .chain(always(metaDb.get(db)))
      .chain((db) => db.put({ ...doc, _id: id }))
      .bimap(
        (err) =>
          err.status === 409
            ? HyperErr({ status: 409, msg: "document conflict" })
            : err,
        omit(["rev"]),
      )
      .bichain(
        handleHyperErr,
        Async.Resolved,
      )
      .toPromise();
  }

  /**
   * @param {RetrieveDocumentArgs}
   * @returns {Promise<Response>}
   */
  function retrieveDocument({ db, id }) {
    return metaDb.get(db)
      .chain((db) => db.get(id))
      .map(omit(["_rev"]))
      .bichain(
        (_) =>
          Async.Rejected(
            HyperErr({ status: 404, msg: "doc not found" }),
          ),
        Async.Resolved,
      )
      .bichain(
        handleHyperErr,
        Async.Resolved,
      )
      .toPromise();
  }

  /**
   * @param {CreateDocumentArgs}
   * @returns {Promise<Response>}
   */
  function updateDocument({ db, id, doc }) {
    return metaDb.get(db)
      .chain((db) =>
        db.get(id)
          .bichain(
            (err) =>
              err.status === 404 ? Async.Resolved(null) : Async.Rejected(err),
            Async.Resolved,
          )
          .chain(
            (old) =>
              old
                // update
                ? db.put({
                  ...doc,
                  _id: id,
                  _rev: old._rev,
                })
                : // create
                  db.put({
                    ...doc,
                    _id: id,
                  }),
          )
      )
      .map(omit(["rev"])) // { ok, id }
      .bichain(
        handleHyperErr,
        Async.Resolved,
      )
      .toPromise();
  }

  /**
   * @param {RetrieveDocumentArgs}
   * @returns {Promise<Response>}
   */
  function removeDocument({ db, id }) {
    return metaDb.get(db)
      .chain((db) =>
        db.get(id)
          .bimap(
            (err) =>
              err.status === 404
                ? HyperErr({ status: 404, msg: "document not found" })
                : err,
            identity,
          )
          .chain((doc) => db.remove(doc))
      )
      .map(omit(["rev"])) // { ok, id }
      .bichain(
        handleHyperErr,
        Async.Resolved,
      )
      .toPromise();
  }

  /**
   * TODO: there seems some differences between Pouch And Couch
   * on how indexes are handled. See https://github.com/pouchdb/pouchdb/issues/8385
   * Because of this, the sort query test in hyper-test is not passing
   *
   * @param {QueryDocumentsArgs}
   * @returns {Promise<Response>}
   */
  function queryDocuments({ db, query }) {
    if (!query.selector) {
      query.selector = {};
    }

    if (query.sort) {
      query.sort = query.sort.map(lowerCaseValue);
      /**
       * TODO: remove when index querying issue is solved in PouchDB
       *
       * This is a hack to get indexes to work similarly across Pouch and Couch
       * See https://github.com/pouchdb/pouchdb/issues/8385
       *
       * Ensure each sort key is present in the selector, if not already in the selector,
       * by adding a check that the sort key exists on the document,
       * This should get around the index querying discrepancy between Pouch and Couch,
       * because fields must exist to be used for sort anyway.
       */
      query.selector = query.sort
        .map((o) => Object.keys(o).pop())
        .reduce(
          (selector, sortKey) => ({
            [sortKey]: { $exists: true },
            /**
             * Will overwrite [sortKey] if it was already present on the selector,
             * making this reduce iter a noop
             */
            ...selector,
          }),
          query.selector,
        );
    }

    return metaDb.get(db)
      .chain((db) => db.find(query))
      .map(prop("docs"))
      .map(foldDocs)
      .map((docs) => ({ ok: true, docs }))
      .bichain(
        handleHyperErr,
        Async.Resolved,
      )
      .toPromise();
  }

  /**
   * @param {IndexDocumentArgs}
   * @returns {Promise<Response>}
   */
  function indexDocuments({ db, name, fields }) {
    return metaDb.get(db)
      .chain((db) =>
        db.createIndex({
          index: {
            fields,
            name,
            // TODO: check this. docs say put it here, but couch puts ddoc outside of index field
            ddoc: name,
          },
          name,
          ddoc: name,
        })
      )
      .bichain(
        handleHyperErr,
        always(Async.Resolved({ ok: true })),
      )
      .toPromise();
  }

  /**
   * @param {ListDocumentArgs}
   * @returns {Promise<Response>}
   */
  function listDocuments(
    { db, limit, startkey, endkey, keys, descending },
  ) {
    // deno-lint-ignore camelcase
    let options = { include_docs: true };
    options = limit ? mergeRight({ limit: Number(limit) }, options) : options;
    options = startkey ? mergeRight({ startkey }, options) : options;
    options = endkey ? mergeRight({ endkey }, options) : options;
    options = keys ? mergeRight({ keys: keys.split(",") }, options) : options;
    options = descending ? mergeRight({ descending }, options) : options;

    return metaDb.get(db)
      .chain((db) => db.allDocs(options))
      .map(prop("rows"))
      .map(pluck("doc"))
      .map(foldDocs)
      .map((docs) => ({ ok: true, docs }))
      .bichain(
        handleHyperErr,
        Async.Resolved,
      )
      .toPromise();
  }

  /**
   * @param {BulkDocumentsArgs}
   * @returns {Promise<Response>}
   */
  function bulkDocuments({ db, docs }) {
    return metaDb.get(db)
      .map(bulk)
      .chain((doBulk) => doBulk({ docs }))
      .map((results) => ({ ok: true, results }))
      .bichain(
        handleHyperErr,
        Async.Resolved,
      )
      .toPromise();
  }

  return Object.freeze({
    createDatabase,
    removeDatabase,
    createDocument,
    retrieveDocument,
    updateDocument,
    removeDocument,
    queryDocuments,
    indexDocuments,
    listDocuments,
    bulkDocuments,
  });
}
