import { assert, assertEquals, validateDataAdapterSchema } from "./dev_deps.js";

import adapterBuilder from "./adapter.js";
import { MetaDb, PouchDbAdapterTypes } from "./meta.js";

const metaDb = MetaDb({ adapter: PouchDbAdapterTypes.memory });

const adapter = adapterBuilder({ db: metaDb });

const random = () => crypto.randomUUID();

Deno.test("should implement the port", () => {
  assert(validateDataAdapterSchema(adapter));
});

Deno.test("should create the database", async () => {
  const db = random();
  await adapter.createDatabase(db)
    .then((res) => assert(res.ok));

  // teardown
  await adapter.removeDatabase(db);
});

Deno.test("should 409 if database already exists", async () => {
  const db = random();
  await adapter.createDatabase(db);

  await adapter.createDatabase(db)
    .catch((err) => err)
    .then((res) => {
      assert(!res.ok);
      assertEquals(409, res.status);
    });

  // teardown
  await adapter.removeDatabase(db);
});

Deno.test("should remove the database", async () => {
  const db = random();
  await adapter.createDatabase(db);

  await adapter.removeDatabase(db)
    .then((res) => assert(res.ok));
});

Deno.test("should 404 if database does not exists", async () => {
  const db = random();

  await adapter.removeDatabase(db)
    .catch((err) => err)
    .then((res) => {
      assert(!res.ok);
      assertEquals(404, res.status);
    });
});

Deno.test("createDocument - should create the document", async () => {
  const db = random();
  await adapter.createDatabase(db);

  await adapter.createDocument({ db, id: "1234", doc: { name: "bar" } })
    .then((res) => assert(res.ok) && assert(res.id));

  // teardown
  await adapter.removeDatabase(db);
});

Deno.test("should 400 if document is empty", async () => {
  const db = random();
  await adapter.createDatabase(db);

  await adapter.createDocument({ db, id: "1234", doc: {} })
    .catch((err) => err)
    .then((res) => {
      assert(!res.ok);
      assertEquals(400, res.status);
    });

  // teardown
  await adapter.removeDatabase(db);
});

Deno.test("should 409 if document with id already exists", async () => {
  const db = random();
  await adapter.createDatabase(db);
  await adapter.createDocument({ db, id: "1234", doc: { name: "bar" } });

  await adapter.createDocument({
    db,
    id: "1234",
    doc: { name: "second bar" },
  })
    .catch((err) => err)
    .then((res) => {
      assert(!res.ok);
      assertEquals(409, res.status);
    });

  // teardown
  await adapter.removeDatabase(db);
});

Deno.test("should retrieve the document", async () => {
  const db = random();
  await adapter.createDatabase(db);
  await adapter.createDocument({ db, id: "1234", doc: { name: "bar" } });

  await adapter.retrieveDocument({ db, id: "1234" })
    .then((res) => assert(res._id) && assert(res.name));

  // teardown
  await adapter.removeDatabase(db);
});

Deno.test("retrieveDocument - should 404 if document does not exist", async () => {
  const db = random();
  await adapter.createDatabase(db);

  await adapter.retrieveDocument({
    db,
    id: "not_found",
  })
    .catch((err) => err)
    .then((res) => {
      assert(!res.ok);
      assertEquals(404, res.status);
    });

  // teardown
  await adapter.removeDatabase(db);
});

Deno.test("updateDocument - should create the document", async () => {
  const db = random();
  await adapter.createDatabase(db);

  await adapter.updateDocument({
    db,
    id: "new_id",
    doc: { name: "bar" },
  })
    .then((res) => assert(res.id) && assert(res.ok));

  // teardown
  await adapter.removeDatabase(db);
});

Deno.test("should update the document", async () => {
  const db = random();
  await adapter.createDatabase(db);
  await adapter.createDocument({ db, id: "new", doc: { name: "bar" } });

  await adapter.updateDocument({ db, id: "new", doc: { name: "bar" } })
    .then((res) => assert(res.id) && assert(res.ok));

  // teardown
  await adapter.removeDatabase(db);
});

Deno.test("should remove the document", async () => {
  const db = random();
  await adapter.createDatabase(db);
  await adapter.createDocument({ db, id: "1234", doc: { name: "bar" } });

  await adapter.removeDocument({ db, id: "1234" })
    .then((res) => assert(res.ok) && assert(res.id));

  // teardown
  await adapter.removeDatabase(db);
});

Deno.test("removeDocument - should 404 if document does not exist", async () => {
  const db = random();
  await adapter.createDatabase(db);

  await adapter.removeDocument({
    db,
    id: "1234",
  })
    .catch((err) => err)
    .then((res) => {
      assert(!res.ok);
      assertEquals(404, res.status);
    });

  // teardown
  await adapter.removeDatabase(db);
});

// Add more tests here for your adapter logic
