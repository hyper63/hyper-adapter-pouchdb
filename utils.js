import { crocks, isHyperErr, R } from "./deps.js";

const { Async, Either, eitherToAsync } = crocks;
const { Left, Right } = Either;

const {
  ifElse,
  complement,
  isNil,
  toLower,
  head,
  toPairs,
  compose,
  filter,
  equals,
} = R;

export const isDefined = complement(isNil);
export const isNotEqual = complement(equals);

export const lowerCaseValue = compose(
  ([k, v]) => ({ [k]: toLower(v) }),
  head,
  toPairs,
);

export const omitDesignDocs = filter(
  (doc) => !(/^_design/.test(doc._id)),
);

const is = (pred) => (value) => (pred(value) ? Right(value) : Left(value));

export const asyncIs = compose(eitherToAsync, is);

export const handleHyperErr = ifElse(
  isHyperErr,
  Async.Resolved,
  Async.Rejected,
);
