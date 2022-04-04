#!/bin/bash

deno lint
deno fmt --check
deno test -A --unstable --no-check=remote
