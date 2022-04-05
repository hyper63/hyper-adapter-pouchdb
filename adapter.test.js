import { assert, assertEquals, validateDataAdapterSchema } from "./dev_deps.js";

import adapterBuilder from "./adapter.js";
import { MetaDb, PouchDbAdapterTypes } from "./meta.js";

const metaDb = MetaDb({ adapter: PouchDbAdapterTypes.memory });

const adapter = adapterBuilder({ db: metaDb });

Deno.test("should implement the port", () => {
  assert(validateDataAdapterSchema(adapter));
});

Deno.test("should create the database", async () => {
  await adapter.createDatabase("foo")
    .then((res) => assert(res.ok));

  // teardown
  await adapter.removeDatabase("foo");
});

Deno.test("should 409 if database already exists", async () => {
  await adapter.createDatabase("foo");

  await adapter.createDatabase("foo")
    .catch((err) => err)
    .then((res) => {
      assert(!res.ok);
      assertEquals(409, res.status);
    });

  // teardown
  await adapter.removeDatabase("foo");
});

Deno.test("should remove the database", async () => {
  await adapter.createDatabase("foo");

  await adapter.removeDatabase("foo")
    .then((res) => assert(res.ok));
});

Deno.test("should 404 if database does not exists", async () => {
  await adapter.removeDatabase("foo")
    .catch((err) => err)
    .then((res) => {
      assert(!res.ok);
      assertEquals(404, res.status);
    });
});

// Add more tests here for your adapter logic
