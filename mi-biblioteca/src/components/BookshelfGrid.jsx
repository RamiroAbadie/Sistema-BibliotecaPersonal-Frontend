import Grid from "@mui/material/Grid";
import Bookshelf from "./BookShelf";
import { LIBRARIES } from "./libraryConfig";

/**
 * Props esperadas:
 *  • books:          Array de libros
 *  • mapLocation:    (book) => { libraryId, shelfIndex } | null
 *  • onBookClick:    (book) => void   (opcional)
 */
export default function BookshelfGrid({ books, mapLocation, onBookClick }) {
  // ─── Agrupar libros por biblioteca y estante ────────────────────────────────
  const grouped = {};
  for (const lib of LIBRARIES) grouped[lib.id] = {};

  for (const book of books) {
    const loc = mapLocation(book);
    if (!loc) continue;                         // libro sin ubicación → se ignora
    const { libraryId, shelfIndex } = loc;

    grouped[libraryId] ??= {};
    grouped[libraryId][shelfIndex] ??= [];
    grouped[libraryId][shelfIndex].push(book);
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Grid container spacing={2} columns={12}>
      {LIBRARIES.map((lib) => (
        <Grid key={lib.id} size={{ xs: 12, md: 6 }}>
          <Bookshelf
            name={lib.name}
            shelves={lib.shelves}
            grouped={grouped[lib.id]}
            onBookClick={onBookClick}   // ← pasamos el callback al estante
          />
        </Grid>
      ))}
    </Grid>
  );
}
