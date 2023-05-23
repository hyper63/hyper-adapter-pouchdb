import { crocks, HyperErr, R } from './deps.js'

const { Async } = crocks
const {
  assoc,
  compose,
  identity,
  has,
  head,
  find,
  filter,
  is,
  lens,
  map,
  omit,
  over,
  path,
  prop,
  pluck,
} = R

/**
 * Moves value.rev to top lvl rev field, then removes key and value fields
 */
const xRevs = map(
  compose(
    omit(['key', 'value']),
    over(
      lens(path(['value', 'rev']), assoc('rev')),
      identity,
    ),
  ),
)

/**
 * @param {*} docs - The docs from the bulk payload
 * @returns a function that accepts a list of docs from the db, to merge with bulk payload
 */
const mergeWithRevs = (docs) => (revs) =>
  map((doc) => {
    /**
     * incoming docs have an _id. revs have an id
     */
    const rev = find((rev) => doc._id === rev.id, revs)
    /**
     * If a rev exists, then update doc,
     * Otherwise, create a doc with no _rev
     * and Pouch will create a new doc with a new rev
     */
    return rev ? { _rev: rev.rev, ...doc } : doc
  }, docs)

const pluckIds = pluck('_id')

const checkDocs = (docs) =>
  is(Object, head(docs))
    ? Async.Resolved(docs)
    : Async.Rejected(HyperErr({ status: 422, msg: 'docs must be objects' }))

export const bulk = (db) => {
  const getDocsThatExist = (ids) => {
    return db.allDocs({ keys: ids })
      .map(prop('rows'))
      .map(filter(has('value')))
      .map(filter((rec) => !rec.value.deleted))
      .map(xRevs)
  }

  const applyBulkDocs = db.bulkDocs

  return ({ docs }) =>
    Async.of(docs)
      .map(map(omit(['_update'])))
      .chain(checkDocs)
      .map(pluckIds)
      .chain(getDocsThatExist)
      .map(mergeWithRevs(map(omit(['_update']), docs)))
      .chain(applyBulkDocs)
      .map(map(omit(['rev'])))
      .map(map((d) => d.error ? assoc('ok', false, d) : d))
}
