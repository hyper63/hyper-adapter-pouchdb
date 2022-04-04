import { assert, validateDataAdapterSchema } from "./dev_deps.js";

import adapterBuilder from "./adapter.js";

const adapter = adapterBuilder();

Deno.test("should implement the port", () => {
  assert(validateDataAdapterSchema(adapter));
});

// Add more tests here for your adapter logic
