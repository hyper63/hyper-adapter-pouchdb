import { assert, assertEquals } from "./dev_deps.js";

import adapterBuilder from "./adapter.js";
import { MetaDb, PouchDbAdapterTypes } from "./meta.js";

const metaDb = MetaDb({ adapter: PouchDbAdapterTypes.memory });

const adapter = adapterBuilder({ db: metaDb });

const random = () => crypto.randomUUID();

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

Deno.test("should be empty if removed and recreated", async () => {
  const db = random();
  await adapter.createDatabase(db);
  await adapter.createDocument({ db, id: "foobar", doc: { foo: "bar" } });

  await adapter.removeDatabase(db)
    .then((res) => assert(res.ok));

  await adapter.createDatabase(db);
  await adapter.retrieveDocument({ db, id: "foobar" })
    .then((res) =>
      assertEquals(res, { ok: false, status: 404, msg: "doc not found" })
    );

  // teardown
  await adapter.removeDatabase(db);
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

Deno.test("should query the documents", async () => {
  const db = random();
  await adapter.createDatabase(db);
  await adapter.createDocument({ db, id: "5", doc: { val: 5 } });
  await adapter.createDocument({ db, id: "6", doc: { val: 6 } });
  await adapter.createDocument({ db, id: "2", doc: { val: 2 } });

  await adapter.queryDocuments({
    db,
    query: {
      selector: {
        val: {
          $gt: 4,
        },
      },
      sort: [
        { _id: "DESC" },
      ],
    },
  })
    .then((res) => {
      assert(res.ok);
      assertEquals(res.docs.length, 2);
      assertEquals(res.docs[0].val, 6);
      assertEquals(res.docs[1].val, 5);
    });

  // teardown
  await adapter.removeDatabase(db);
});

Deno.test("should query with empty selector", async () => {
  const db = random();
  await adapter.createDatabase(db);
  await adapter.createDocument({ db, id: "5", doc: { val: 5 } });
  await adapter.createDocument({ db, id: "6", doc: { val: 6 } });
  await adapter.createDocument({ db, id: "2", doc: { val: 2 } });

  await adapter.queryDocuments({
    db,
    query: {},
  })
    .then((res) => {
      assert(res.ok);
      assertEquals(res.docs.length, 3);
    });

  // teardown
  await adapter.removeDatabase(db);
});

Deno.test("should create and name an index", async () => {
  const db = random();
  await adapter.createDatabase(db);
  await adapter.createDocument({ db, id: "5", doc: { val: 5 } });

  await adapter.indexDocuments({
    db,
    name: "val-index",
    fields: ["val"],
  })
    .then((res) => {
      assert(res.ok);
    });

  await adapter.queryDocuments({
    db,
    query: {
      sort: [
        { val: "ASC" },
      ],
      use_index: "val-index",
    },
  }).then((res) => {
    assert(res.ok);
  });

  // teardown
  await adapter.removeDatabase(db);
});

Deno.test("should list documents", async () => {
  const db = random();
  await adapter.createDatabase(db);
  await adapter.createDocument({ db, id: "5", doc: { val: 5 } });
  await adapter.createDocument({ db, id: "6", doc: { val: 6 } });
  await adapter.createDocument({ db, id: "2", doc: { val: 2 } });
  await adapter.createDocument({ db, id: "3", doc: { val: 3 } });
  await adapter.createDocument({ db, id: "1", doc: { val: 1 } });

  await adapter.listDocuments({
    db,
    startkey: "4",
    endkey: "1",
    limit: 2,
    descending: true,
  })
    .then((res) => {
      assert(res.ok);
      assertEquals(res.docs.length, 2);
      assertEquals(res.docs[0]._id, "3");
      assertEquals(res.docs[1]._id, "2");
    });

  // teardown
  await adapter.removeDatabase(db);
});

Deno.test("should perform the bulk operation", async () => {
  const db = random();
  await adapter.createDatabase(db);
  await adapter.createDocument({ db, id: "4", doc: { val: 4 } });
  await adapter.createDocument({ db, id: "5", doc: { val: 5 } });

  await adapter.bulkDocuments({
    db,
    docs: [
      { _id: "6", val: 6 },
      { _id: "5", val: 55 },
      { _id: "4", _deleted: true },
    ],
  })
    .then((res) => {
      assert(res.ok);
      assertEquals(res.results.length, 3);
    });

  await adapter.listDocuments({ db })
    .then((res) => {
      assertEquals(res.docs.length, 2);
      assertEquals(res.docs[0].val, 55);
      assertEquals(res.docs[1].val, 6);
    });

  // teardown
  await adapter.removeDatabase(db);
});

// Add more tests here for your adapter logic
