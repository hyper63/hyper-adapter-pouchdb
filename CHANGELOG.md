# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.2.1](https://github.com/hyper63/hyper-adapter-pouchdb/compare/v0.2.0...v0.2.1) (2023-11-29)

## [0.2.0](https://github.com/hyper63/hyper-adapter-pouchdb/compare/v0.1.7...v0.2.0) (2023-05-31)


### Features

* **indexDocuments:** add support for specifying index sort direction ([15c3981](https://github.com/hyper63/hyper-adapter-pouchdb/commit/15c3981ede30f8ead056cc6c183e8e43d41ef67c))
* **queryDocuments:** expand sort syntax support ([8dd469b](https://github.com/hyper63/hyper-adapter-pouchdb/commit/8dd469bc97274b8664398ac0db90457c1a2721b1))

## [0.1.7](https://github.com/hyper63/hyper-adapter-pouchdb/compare/v0.1.6...v0.1.7) (2023-05-23)

### [0.1.6](https://github.com/hyper63/hyper-adapter-pouchdb/compare/v0.1.5...v0.1.6) (2022-09-02)

### [0.1.5](https://github.com/hyper63/hyper-adapter-pouchdb/compare/v0.1.4...v0.1.5) (2022-05-13)


### Bug Fixes

* **listDocuments,queryDocuments:** fold over docs, filtering out bad values ([5e2aa1e](https://github.com/hyper63/hyper-adapter-pouchdb/commit/5e2aa1e61695b648a281191b0025bb391210670b))

### [0.1.4](https://github.com/hyper63/hyper-adapter-pouchdb/compare/v0.1.3...v0.1.4) (2022-05-02)


### Bug Fixes

* add shim to add all sort keys to selector [#25](https://github.com/hyper63/hyper-adapter-pouchdb/issues/25) ([ea462c0](https://github.com/hyper63/hyper-adapter-pouchdb/commit/ea462c000870ccd41f73a76e25d083a1d02ce79d))

### [0.1.3](https://github.com/hyper63/hyper-adapter-pouchdb/compare/v0.1.2...v0.1.3) (2022-05-02)


### Features

* **indexeddb:** add indexeddb storage option [#25](https://github.com/hyper63/hyper-adapter-pouchdb/issues/25) ([b243985](https://github.com/hyper63/hyper-adapter-pouchdb/commit/b243985047f0658f3af3a84c64c5af0856362f3c))

### [0.1.2](https://github.com/hyper63/hyper-adapter-pouchdb/compare/v0.1.1...v0.1.2) (2022-05-02)


### Bug Fixes

* **removeDatabase:** database is actually destroyed [#28](https://github.com/hyper63/hyper-adapter-pouchdb/issues/28) ([1bf89ec](https://github.com/hyper63/hyper-adapter-pouchdb/commit/1bf89ec5d7ec638c929c3017b6900d6b0105fa9c))

### [0.1.1](https://github.com/hyper63/hyper-adapter-pouchdb/compare/v0.1.0...v0.1.1) (2022-04-21)


### Features

* allow passing dir in options [#26](https://github.com/hyper63/hyper-adapter-pouchdb/issues/26) ([0f70396](https://github.com/hyper63/hyper-adapter-pouchdb/commit/0f703962115129cfb354fa3ecebe4e6edcc91491))

## 0.1.0 (2022-04-06)


### Features

* add utils and api for managing pouchdbs ([431b755](https://github.com/hyper63/hyper-adapter-pouchdb/commit/431b7554953a11786eee7745c4fbe243997f9b9d))
* bulkDocuments impl [#11](https://github.com/hyper63/hyper-adapter-pouchdb/issues/11) ([852c83b](https://github.com/hyper63/hyper-adapter-pouchdb/commit/852c83b059f6244193b05b6e521d64db17f835b8))
* createDatabase impl [#2](https://github.com/hyper63/hyper-adapter-pouchdb/issues/2) ([35eeb34](https://github.com/hyper63/hyper-adapter-pouchdb/commit/35eeb348db41f2a6706d03ce5ac6eb57991c8abe))
* createDocument impl [#4](https://github.com/hyper63/hyper-adapter-pouchdb/issues/4) ([ec33a1a](https://github.com/hyper63/hyper-adapter-pouchdb/commit/ec33a1a315fcd67f25d535f90d74cee47cc75630))
* indexDocuments impl [#9](https://github.com/hyper63/hyper-adapter-pouchdb/issues/9) ([3d50f91](https://github.com/hyper63/hyper-adapter-pouchdb/commit/3d50f91cb2ae3d5653e2accf4fe158eef62587ce))
* listDocuments impl [#10](https://github.com/hyper63/hyper-adapter-pouchdb/issues/10) ([b643178](https://github.com/hyper63/hyper-adapter-pouchdb/commit/b643178afc28241502e9464a38329a33d4ade001))
* queryDocuments impl [#8](https://github.com/hyper63/hyper-adapter-pouchdb/issues/8) ([6e2f2bf](https://github.com/hyper63/hyper-adapter-pouchdb/commit/6e2f2bf6e6a9c4665988dd1fa667b3e4df98af3b))
* removeDocument impl [#5](https://github.com/hyper63/hyper-adapter-pouchdb/issues/5) ([e59f255](https://github.com/hyper63/hyper-adapter-pouchdb/commit/e59f255111ecba5a384d55fddf95da9ec3d252a5))
* retrieveDocument impl [#7](https://github.com/hyper63/hyper-adapter-pouchdb/issues/7) ([9be6887](https://github.com/hyper63/hyper-adapter-pouchdb/commit/9be6887fafc73554d5053c726153c3694e508d47))
* updateDocument impl [#6](https://github.com/hyper63/hyper-adapter-pouchdb/issues/6) ([fcb4559](https://github.com/hyper63/hyper-adapter-pouchdb/commit/fcb45597c8f8f509ba4933722c995d03cfb19f1c))
