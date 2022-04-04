// deno-lint-ignore-file no-unused-vars

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

export default function (_env) {
  /**
   * @param {string} name
   * @returns {Promise<Response>}
   */
  async function createDatabase(name) {}

  /**
   * @param {string} name
   * @returns {Promise<Response>}
   */
  async function removeDatabase(name) {}

  /**
   * @param {CreateDocumentArgs}
   * @returns {Promise<Response>}
   */
  async function createDocument({ db, id, doc }) {}

  /**
   * @param {RetrieveDocumentArgs}
   * @returns {Promise<Response>}
   */
  async function retrieveDocument({ db, id }) {}

  /**
   * @param {CreateDocumentArgs}
   * @returns {Promise<Response>}
   */
  async function updateDocument({ db, id, doc }) {}

  /**
   * @param {RetrieveDocumentArgs}
   * @returns {Promise<Response>}
   */
  async function removeDocument({ db, id }) {}

  /**
   * @param {QueryDocumentsArgs}
   * @returns {Promise<Response>}
   */
  async function queryDocuments({ db, query }) {}

  /**
   * @param {IndexDocumentArgs}
   * @returns {Promise<Response>}
   */

  async function indexDocuments({ db, name, fields }) {}

  /**
   * @param {ListDocumentArgs}
   * @returns {Promise<Response>}
   */
  async function listDocuments(
    { db, limit, startkey, endkey, keys, descending },
  ) {}

  /**
   * @param {BulkDocumentsArgs}
   * @returns {Promise<Response>}
   */
  async function bulkDocuments({ db, docs }) {}

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
