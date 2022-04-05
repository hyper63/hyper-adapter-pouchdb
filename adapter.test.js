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

Deno.test("should create the document", async () => {
  await adapter.createDatabase("foo");

  await adapter.createDocument({ db: "foo", id: "1234", doc: { name: "bar" } })
    .then((res) => assert(res.ok) && assert(res.id));

  // teardown
  await adapter.removeDatabase("foo");
});

Deno.test("should 400 if document is empty", async () => {
  await adapter.createDatabase("foo");

  await adapter.createDocument({ db: "foo", id: "1234", doc: {} })
    .catch((err) => err)
    .then((res) => {
      assert(!res.ok);
      assertEquals(400, res.status);
    });

  // teardown
  await adapter.removeDatabase("foo");
});

Deno.test("should 409 if document with id already exists", async () => {
  await adapter.createDatabase("foo");
  await adapter.createDocument({ db: "foo", id: "1234", doc: { name: "bar" } });

  await adapter.createDocument({
    db: "foo",
    id: "1234",
    doc: { name: "second bar" },
  })
    .catch((err) => err)
    .then((res) => {
      assert(!res.ok);
      assertEquals(409, res.status);
    });

  // teardown
  await adapter.removeDatabase("foo");
});

Deno.test("should retrieve the document", async () => {
  await adapter.createDatabase("foo");
  await adapter.createDocument({ db: "foo", id: "1234", doc: { name: "bar" } });

  await adapter.retrieveDocument({ db: "foo", id: "1234" })
    .then((res) => assert(res._id) && assert(res.name));

  // teardown
  await adapter.removeDatabase("foo");
});

Deno.test("should 404 if document does not exist", async () => {
  await adapter.createDatabase("foo");

  await adapter.retrieveDocument({
    db: "foo",
    id: "not_found",
  })
    .catch((err) => err)
    .then((res) => {
      assert(!res.ok);
      assertEquals(404, res.status);
    });

  // teardown
  await adapter.removeDatabase("foo");
});

Deno.test("should remove the document", async () => {
  await adapter.createDatabase("foo");
  await adapter.createDocument({ db: "foo", id: "1234", doc: { name: "bar" } });

  await adapter.removeDocument({ db: "foo", id: "1234" })
    .then((res) => assert(res.ok) && assert(res.id));

  // teardown
  await adapter.removeDatabase("foo");
});

Deno.test("should 404 if document does not exist", async () => {
  await adapter.createDatabase("foo");

  await adapter.removeDocument({
    db: "foo",
    id: "1234",
  })
    .catch((err) => err)
    .then((res) => {
      assert(!res.ok);
      assertEquals(404, res.status);
    });

  // teardown
  await adapter.removeDatabase("foo");
});

// Add more tests here for your adapter logic
