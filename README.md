# README

hyper adapter template for `data` port, use this template to create a hyper
adapter.

Replace `{{ADAPTER_NAME}}` with your adapter name in `mod.js`

## Testing

run `./scripts/test.sh` to lint, check format, and run tests

run `./scripts/harness.sh` to spin up a local instance of `hyper` using your
adapter for the data port

## TODO

- Add automation to set adapter name
- Add automation to set `port`
- Add automation to scaffold adapter methods, based on selected `port`
