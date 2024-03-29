import { crocks, isHyperErr, R } from './deps.js'

const { Async, Either, eitherToAsync } = crocks
const { Left, Right } = Either

const {
  ifElse,
  complement,
  isNil,
  toLower,
  head,
  toPairs,
  compose,
  equals,
  allPass,
  omit,
  transduce,
  append,
  pluck,
  map,
  filter,
  is: rIs,
  cond,
  defaultTo,
  identity,
  T,
} = R

export const isNotEqual = complement(equals)

export const isDefined = complement(isNil)

export const isDesignDoc = (doc) => (/^_design/.test(doc._id))
export const isNotDesignDoc = complement(isDesignDoc)

export const omitRev = omit(['rev', '_rev'])

/**
 * A transduce allows us to iterate the array only once,
 * performing composed transformations inlined with reducing,
 * -- hence "trans"-"duce".
 *
 * This prevents iterating the array multiple times to perform multiple
 * transformations
 *
 * NOTE: compositions passed to transduce run top -> bottom instead of the usual
 * bottom to top. This is becase we are composing transformers which are functions
 * not values
 */
export const foldWith = (transformer) => (iter) =>
  transduce(transformer, (acc, item) => append(item, acc), [], iter)

export const sanitizeDocs = foldWith(
  compose(
    filter(allPass([isDefined, isNotDesignDoc])),
    map(omitRev),
  ),
)

/**
 * Each row is like
 * {
      key: '1',
      id: '1',
      value: { rev: '1' },
      doc: { _id: '1', _rev: '1', hello: 'world' },
    }

    So pluck the doc first to pass into sanitizing
  */
export const sanitizeRows = foldWith(
  compose(
    pluck('doc'),
    filter(allPass([isDefined, isNotDesignDoc])),
    map(omitRev),
  ),
)

const is = (pred) => (value) => (pred(value) ? Right(value) : Left(value))
export const asyncIs = compose(eitherToAsync, is)

export const handleHyperErr = ifElse(
  isHyperErr,
  Async.Resolved,
  Async.Rejected,
)

/**
 * Given an array of hyper sort criteria,
 * return an array of Couch sort criteria.
 *
 * If no, sort criteria is provided, then this noops
 *
 * @param {string[] | Object[]} [sort]
 * @returns {string[] | Object[] | undefined}
 */
export const mapSort = (sort) => {
  if (!sort || !sort.length) return sort

  return sort.map(cond([
    [rIs(String), identity],
    [
      rIs(Object),
      compose(
        ([k, v]) => ({ [k]: toLower(v) }),
        head,
        toPairs,
      ),
    ],
    [T, identity],
  ]))
}

/**
 * Given a hyper selector, default to an empty object
 * if the selector is nil
 */
export const mapSelector = defaultTo({})
