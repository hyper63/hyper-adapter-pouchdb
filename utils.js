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
  reduce,
  equals,
  allPass,
  omit,
  always,
} = R;

export const isDefined = complement(isNil);
export const isNotEqual = complement(equals);

export const lowerCaseValue = compose(
  ([k, v]) => ({ [k]: toLower(v) }),
  head,
  toPairs,
);

export const foldDocs = (all) =>
  reduce(
    (docs, doc) => {
      return ifElse(
        allPass([
          isDefined, // must be defined
          (doc) => !(/^_design/.test(doc._id)), // filter out all design docs
        ]),
        (doc) => {
          docs.push(omit(["_rev"], doc));
          return docs;
        },
        always(docs),
      )(doc);
    },
    [],
    all,
  );

const is = (pred) => (value) => (pred(value) ? Right(value) : Left(value));

export const asyncIs = compose(eitherToAsync, is);

export const handleHyperErr = ifElse(
  isHyperErr,
  Async.Resolved,
  Async.Rejected,
);
