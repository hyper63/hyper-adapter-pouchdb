<h1 align="center">hyper-adapter-pouchdb</h1>
<p align="center">A Data port adapter that uses PouchDB in the <a href="https://hyper.io/">hyper</a>  service framework</p>
</p>
<p align="center">
  <a href="https://nest.land/package/hyper-adapter-pouchdb"><img src="https://nest.land/badge.svg" alt="Nest Badge" /></a>
  <a href="https://github.com/hyper63/hyper-adapter-pouchdb/actions/workflows/test.yml"><img src="https://github.com/hyper63/hyper-adapter-pouchdb/actions/workflows/test.yml/badge.svg" alt="Test" /></a>
  <a href="https://github.com/hyper63/hyper-adapter-pouchdb/tags/"><img src="https://img.shields.io/github/tag/hyper63/hyper-adapter-pouchdb" alt="Current Version" /></a>
</p>

---

There are some differences between `PouchDB` And `CouchDB` on how indexes are
handled. See this
[open issue on PouchDB](https://github.com/pouchdb/pouchdb/issues/8385):

> With PouchDB, it is expected that all the indexed fields exist in the
> `selector`, otherwise an error is returned. With CouchDB, it is expected that
> all the indexed fields exist in the `selector` OR in the `sort`.

Take this into consideration when using this adapter. An issue is open to track
this [here](https://github.com/hyper63/hyper-adapter-pouchdb/issues/25)

## Table of Contents

- [Getting Started](#getting-started)
  - [Storage Options](#storage-options)
- [Installation](#installation)
- [Features](#features)
- [Methods](#methods)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

`hyper.config.js`

```js
import { default as pouchdb } from "https://x.nest.land/hyper-adapter-pouchdb@VERSION/mod.js";

export default {
  app: opine,
  adapter: [
    { port: "data", plugins: [pouchdb()] },
  ],
};
```

### Storage Options

This adapter can use either `memory` or `idb` (IndexedDB polyfill) for `PouchDB`
storage. You may choose which storage to use by passing the `storage` option to
the adapter:

```js
import {
  default as pouchdb,
  PouchDbAdapterTypes,
} from "https://x.nest.land/hyper-adapter-pouchdb@VERSION/mod.js";

pouchdb({ storage: PouchDbAdapterTypes.memory });
// OR use IndexedDB for persistence
pouchdb({ storage: PouchDbAdapterTypes.idb });
```

## Installation

This is a Deno module available to import from
[nest.land](https://nest.land/package/hyper-adapter-pouchdb)

deps.js

```js
export { default as pouchdb } from "https://x.nest.land/hyper-adapter-pouchdb@VERSION/mod.js";
```

## Features

- Create a `PouchDB` datastore
- Remove a `PouchDB` datastore
- Create a document in a `PouchDB` datastore
- Retrieve a document in a `PouchDB` datastore
- Update a document in a `PouchDB` datastore
- Remove a document from a `PouchDB` datastore
- List documents in a `PouchDB` datastore
- Query documents in a `PouchDB` datastore
- Index documents in a `PouchDB` datastore
- Bulk create documents in a `PouchDB` datastore

## Methods

This adapter fully implements the Data port and can be used as the
[hyper Data service](https://docs.hyper.io/data-api) adapter

See the full port [here](https://nest.land/package/hyper-port-data)

## Contributing

Contributions are welcome! See the hyper
[contribution guide](https://docs.hyper.io/oss/contributing-to-hyper)

## Testing

```
./scripts/test.sh
```

To lint, check formatting, and run unit tests

## License

Apache-2.0
