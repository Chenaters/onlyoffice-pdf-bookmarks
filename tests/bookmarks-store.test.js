const assert = require("node:assert/strict");
const test = require("node:test");

const {
  BookmarkStore,
  cleanTitle,
  createDocumentIdentity,
  createStorageKey,
  getBaseName,
  normalizeIdentity
} = require("../pdf-bookmarks/bookmarks-store.js");

function createMemoryStorage() {
  const data = new Map();
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    }
  };
}

test("normalizes equivalent Windows PDF paths to one storage key", () => {
  const left = "file:///C:/Users/Alice/Documents/Guide.pdf";
  const right = "c:\\users\\alice\\documents\\guide.pdf";

  assert.equal(normalizeIdentity(left), "c:/users/alice/documents/guide.pdf");
  assert.equal(createStorageKey(left), createStorageKey(right));
  assert.equal(getBaseName(left), "guide.pdf");
});

test("uses a stable PDF identity when desktop source paths change", () => {
  const first = createDocumentIdentity(
    "C:\\Temp\\session-a\\bookmark-persistence-test.pdf",
    "data:image/png;base64,stable-first-page"
  );
  const reopened = createDocumentIdentity(
    "C:\\Temp\\session-b\\bookmark-persistence-test.pdf",
    "data:image/png;base64,stable-first-page"
  );

  assert.equal(first, reopened);
  assert.equal(createStorageKey(first), createStorageKey(reopened));
});

test("separates same-named PDFs when their first pages differ", () => {
  const first = createDocumentIdentity("report.pdf", "first-page-a");
  const second = createDocumentIdentity("report.pdf", "first-page-b");

  assert.notEqual(createStorageKey(first), createStorageKey(second));
});

test("adds and loads bookmarks in page order", () => {
  const storage = createMemoryStorage();
  let now = 100;
  const store = new BookmarkStore(storage, "C:\\docs\\sample.pdf", () => now++);
  let bookmarks = [];

  bookmarks = store.add(bookmarks, 7, "Conclusion").bookmarks;
  bookmarks = store.add(bookmarks, 1, "Overview").bookmarks;

  assert.deepEqual(store.load().map(({ pageIndex, title }) => ({ pageIndex, title })), [
    { pageIndex: 1, title: "Overview" },
    { pageIndex: 7, title: "Conclusion" }
  ]);
});

test("renames, removes, and clears bookmarks", () => {
  const storage = createMemoryStorage();
  const store = new BookmarkStore(storage, "C:\\docs\\sample.pdf", () => 200);
  const added = store.add([], 2, "  Key   chart  ");
  const id = added.bookmark.id;

  let bookmarks = store.rename(added.bookmarks, id, "Updated chart");
  assert.equal(bookmarks[0].title, "Updated chart");

  bookmarks = store.remove(bookmarks, id);
  assert.deepEqual(bookmarks, []);

  store.add([], 4, "Another");
  assert.deepEqual(store.clear(), []);
  assert.deepEqual(store.load(), []);
});

test("repairs blank titles and ignores corrupt storage", () => {
  assert.equal(cleanTitle("   ", 4), "Page 5");

  const storage = createMemoryStorage();
  const store = new BookmarkStore(storage, "broken.pdf");
  storage.setItem(store.key, "not-json");

  assert.deepEqual(store.load(), []);
});

test("keeps separate bookmark lists for separate PDFs", () => {
  const storage = createMemoryStorage();
  const first = new BookmarkStore(storage, "C:\\docs\\first.pdf", () => 1);
  const second = new BookmarkStore(storage, "C:\\docs\\second.pdf", () => 2);

  first.add([], 0, "First PDF");
  second.add([], 9, "Second PDF");

  assert.equal(first.load()[0].title, "First PDF");
  assert.equal(second.load()[0].title, "Second PDF");
});

test("explicit close flush preserves the current bookmark list", () => {
  const storage = createMemoryStorage();
  const store = new BookmarkStore(storage, "C:\\docs\\closing.pdf", () => 300);
  const bookmarks = store.add([], 3, "Resume here").bookmarks;

  store.save(bookmarks);

  const reopenedStore = new BookmarkStore(storage, "C:\\docs\\closing.pdf");
  assert.deepEqual(
    reopenedStore.load().map(({ pageIndex, title }) => ({ pageIndex, title })),
    [{ pageIndex: 3, title: "Resume here" }]
  );
});
