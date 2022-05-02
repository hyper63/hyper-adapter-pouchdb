hyper_test=https://x.nest.land/hyper-test@2.1.3

deno test --reload --allow-net --allow-env --no-check --import-map="$hyper_test/import_map.json" "$hyper_test/mod.js"