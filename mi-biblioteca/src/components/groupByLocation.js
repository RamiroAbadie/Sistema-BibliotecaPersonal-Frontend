export function groupBooks(books, getLoc) {
  // getLoc(book) debe devolver { libraryId, shelfIndex } (shelfIndex base 1)
  const map = {};
  for (const b of books) {
    const loc = getLoc(b);
    if (!loc) continue;
    const { libraryId, shelfIndex } = loc;
    map[libraryId] ??= {};
    map[libraryId][shelfIndex] ??= [];
    map[libraryId][shelfIndex].push(b);
  }
  return map;
}
