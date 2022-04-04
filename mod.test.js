import { assert, validateFactorySchema } from "./dev_deps.js";

import factory from "./mod.js";

Deno.test("should be a valid schema", () => {
  assert(validateFactorySchema(factory()));
});
