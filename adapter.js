import { crocks, HyperErr, R } from "./deps.js";

import { handleHyperErr } from "./utils.js";

const { Async } = crocks;

const { always } = R;

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
    return Promise.resolve(HyperErr({ status: 501, msg: "Not Implemented" }));
  }

  /**
   * @param {RetrieveDocumentArgs}
   * @returns {Promise<Response>}
   */
  function retrieveDocument({ db, id }) {
    return Promise.resolve(HyperErr({ status: 501, msg: "Not Implemented" }));
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
    return Promise.resolve(HyperErr({ status: 501, msg: "Not Implemented" }));
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
