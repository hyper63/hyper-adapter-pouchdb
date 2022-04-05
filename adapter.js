import { crocks, HyperErr, R } from "./deps.js";

import { handleHyperErr } from "./utils.js";

const { Async } = crocks;

const { always, omit, isEmpty, identity } = R;

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
    return Promise.resolve(HyperErr({ status: 501, msg: "Not Implemented" }));
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
   * @param {QueryDocumentsArgs}
   * @returns {Promise<Response>}
   */
  function queryDocuments({ db, query }) {
    return Promise.resolve(HyperErr({ status: 501, msg: "Not Implemented" }));
  }

  /**
   * @param {IndexDocumentArgs}
   * @returns {Promise<Response>}
   */

  function indexDocuments({ db, name, fields }) {
    return Promise.resolve(HyperErr({ status: 501, msg: "Not Implemented" }));
  }

  /**
   * @param {ListDocumentArgs}
   * @returns {Promise<Response>}
   */
  function listDocuments(
    { db, limit, startkey, endkey, keys, descending },
  ) {
    return Promise.resolve(HyperErr({ status: 501, msg: "Not Implemented" }));
  }

  /**
   * @param {BulkDocumentsArgs}
   * @returns {Promise<Response>}
   */
  function bulkDocuments({ db, docs }) {
    return Promise.resolve(HyperErr({ status: 501, msg: "Not Implemented" }));
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
