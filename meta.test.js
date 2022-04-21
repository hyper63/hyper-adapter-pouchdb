import { assertEquals } from "./dev_deps.js";

import { createPouch } from "./meta.js";

Deno.test({
  name: "should add trailing slash to prefix",
  // indexed db keeps files open expecting to be long-lived, so just ignore those in this test
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const foo = await createPouch("foo", {
      adapter: "idb",
      prefix: "./test",
      systemPath: "./test",
    });
    assertEquals(foo.__opts.prefix, "./test/");
  },
});
