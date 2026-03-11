Dexie lives in that curious middle ground where JavaScript storage stops being “slap some JSON in localStorage and pray” and starts behaving like a real database. It’s basically a civilised wrapper over IndexedDB—civilised in the sense that it removes the callback-ridden, error-prone medieval torture apparatus that IndexedDB exposes by default.

It doesn’t pretend to be a universal state manager, nor a sync engine, nor a CRDT playground. It does one job: **make IndexedDB fast, pleasant, and structurally sane**, while letting you think in terms of tables, indexes, and transactions instead of event handlers and arcane IDB boilerplate.

Here’s the shape of it.

---

## What Dexie actually is

IndexedDB itself is a transactional object store with indexes. It’s absurdly capable—stores gigabytes, does range queries, supports indexes—but the API feels like something that crawled out of the primordial soup. Dexie gives you a modern, typed, Promise-based façade:

- You declare a database schema in a single string.
- You issue queries with familiar methods (`where`, `equals`, `startsWith`, etc.).
- You wrap multiple operations in a transaction that behaves like a normal transaction.
- You handle upgrades declaratively instead of juggling IDB versionchange events.

Dexie doesn’t abstract away IndexedDB; it simply exposes a sane representation of it.

---

## A tiny taste

The canonical Dexie database looks something like this:

```ts
import Dexie from 'dexie';

class WildsideDB extends Dexie {
  routes;
  tiles;
  notes;

  constructor() {
    super('wildside');

    this.version(1).stores({
      routes: 'id,name,updatedAt',
      tiles: '[z+x+y],z,x,y,bundleId',
      notes: 'id,routeId,updatedAt',
    });
  }
}

export const db = new WildsideDB();

// Usage:
const edinburgh = await db.routes.get('edinburgh-old-town');

const tilesForZ14 = await db.tiles
  .where('z')
  .equals(14)
  .toArray();

```

The appeal is immediate: the mental model is “small SQLite”, not “screaming into the asynchronous void”.

---

## Where Dexie shines

### 1. Managing large local datasets

Dexie is built for situations where you might store _thousands_ or _millions_ of records in the browser, efficiently, with indexed lookups. That’s exactly why people reach for it in mapping PWAs, note-taking apps, offline CRMs, and anything involving attachments or binary blobs.

Dexie doesn’t blink at 500MB of tiles. LocalStorage would die of fright.

### 2. Bulk inserts and high-throughput operations

Native IndexedDB supports bulk ops, but you have to dance. Dexie turns mass tile import into a straight-line `bulkPut()` call.

```ts
await db.tiles.bulkPut(tileRecords);  // 10k+ ops in one go

```

For map tiles or offline bundles, this matters.

### 3. Price/performance sweet spot

Dexie gives you 90% of the capability of full local-first databases (Pouch, RxDB, ElectricSQL, etc.) at 5% of the complexity. You still get:

- indexed queries
- transactions
- multi-store schema
- binary blob storage
- upgrade path
- excellent browser portability

but without pulling in MVCC sync machinery or conflict resolvers you don’t need.

### 4. Extremely stable and well-maintained

IndexedDB is part of the browser platform and isn’t going anywhere. Dexie builds directly on it, with no external daemon or runtime. It’s one of the more boringly reliable pieces of the web stack.

---

## The bits Dexie doesn’t do (and shouldn’t)

Dexie is not:

- a state manager
- a sync framework
- an optimistic update engine
- a CRDT store
- a distributed database

It doesn’t solve “how do I reconcile data from the server later?”. It just stores bytes in a structured way and lets you retrieve them very quickly.

That’s exactly why it pairs cleanly with **TanStack Query**, **Zustand**, and **a service worker**: it behaves like a local storage engine, not a worldview.

---

## Why Dexie fits beautifully in Wildside’s architecture

Your Wildside PWA wants to do three jobs offline:

1. Store large asset bundles (map tiles, static GeoJSON, fonts, imagery).
2. Store user-created data (notes, progress, “visited” flags).
3. Keep the UI predictable and reactive while offline.

Dexie does 1 and 2 without invading 3.

- **TanStack Query** stays in charge of domain data and server communication.
- **Zustand** stays in charge of UI state.
- **Dexie** becomes your durable data engine for “everything heavy or binary”.

You get a clean separation:

- “What do I show in the UI?” → Zustand/Query
- “What needs re-syncing?” → Query + the outbox
- “Where do the bytes live?” → Dexie

This division of labour scales, makes testing easier, and avoids the architectural contortions of PouchDB/RxDB where the database starts eating the whole app.

---

## Performance profile

Dexie’s performance is mostly IndexedDB’s performance, which is surprisingly decent:

- Bulk inserts of tens of thousands of items in a transaction: fine.
- Lookups by compound keys: very fast.
- Range queries via indexes: fast.
- Iterating through hundreds of thousands of map tiles: fine, but you stream them, not grab them all at once.
- Blob storage: depends on browser; Chrome’s IDB handles blobs gracefully.

For map tiles specifically: keep tiles in Dexie or Cache Storage depending on your caching strategy. Dexie gives you more control; Cache Storage gives you more “free” caching semantics.

---

## The “developer ergonomics” bit

Dexie is pleasant in the mundane way a good screwdriver is pleasant: it gets out of your way.

Migrations are clear:

```ts
db.version(2).stores({
  notes: 'id,routeId,userId,updatedAt'
});

```

Transactions are explicit:

```ts
await db.transaction('rw', db.notes, db.routes, async () => {
  await db.notes.put(newNote);
  await db.routes.update(routeId, { updatedAt: Date.now() });
});

```

Complex queries are succinct:

```ts
const notesForRoute = await db.notes
  .where('routeId')
  .equals(routeId)
  .reverse()
  .sortBy('updatedAt');

```

You’re not fighting the browser; you’re writing code that feels obvious.

---

## In summary

Dexie gives you:

- A fast, typed, ergonomic wrapper over IndexedDB
- Proper indexed queries
- Real transactions
- Blob support
- Bulk operations
- Declarative migrations
- Zero ceremony
- Zero conflict with TanStack Query / Zustand

It’s effectively the local storage engine you wish the web had shipped with.

For Wildside, Dexie fills the **“offline data warehouse”** role without forcing the UI to adopt a database-centred worldview, which keeps your architecture clean:

- Query handles server state + persistence + optimistic mutations.
- Dexie handles heavy assets + outbox + user attachments.
- Zustand handles UI wibble.
- MapLibre interacts with Dexie or the service worker for tiles.

If you’d like I can show you a concrete Wildside PWA architecture sketch with Dexie in the loop, including how to structure route bundles, tile metadata, outbox queues, and SW interactions.
