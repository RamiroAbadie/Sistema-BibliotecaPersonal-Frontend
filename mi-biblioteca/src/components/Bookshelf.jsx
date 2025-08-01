import { Box, Paper, Typography } from "@mui/material";
import BookCard from "./BookCard";

/**
 * Renderiza una biblioteca con sus estantes.
 *
 * Props:
 *  • name:       string           –  Nombre visible de la biblioteca.
 *  • shelves:    number           –  Cantidad total de estantes.
 *  • grouped:    { [númeroEstante]: Book[] }
 *                 Mapa de estante → array de libros. Pueden faltar claves.
 *  • onBookClick?: (book) => void –  (Opc.) callback al hacer click en una BookCard.
 */
export default function Bookshelf({ name, shelves, grouped, onBookClick }) {
  // Pintamos de abajo → arriba (Estante 1 en la fila inferior)
  const shelfIndexes = Array.from({ length: shelves }, (_, i) => shelves - i);

  return (
    <Paper variant="outlined" sx={{ p: 1.5, minWidth: 260 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
        {name}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {shelfIndexes.map((shelfIndex) => {
          const books = grouped?.[shelfIndex] ?? [];
          return (
            <Box
              key={shelfIndex}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "stretch",
                borderBottom: "1px solid",
                borderColor: "divider",
                p: 1,
                minHeight: 100,
                overflowX: "auto",
                borderRadius: 1,
                bgcolor: "background.paper",
              }}
            >
              {books.map((b, idx) => (
                <BookCard
                  key={b.idLibro ?? b.id ?? b.isbn ?? `${b.titulo}-${idx}`}
                  book={b}
                  onClick={() => onBookClick?.(b)}
                />
              ))}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
