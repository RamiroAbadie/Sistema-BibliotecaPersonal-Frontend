import { useState } from "react";
import { useSelector } from "react-redux";
import { Alert, CircularProgress, Box } from "@mui/material";
import BookshelfGrid from "../components/BookshelfGrid";
import { mapLocationFromBook } from "../components/mapLocation";
import BookDetailsDialog from "../components/BookDetailsDialog";

export default function Home() {
  const [selectedBook, setSelectedBook] = useState(null);
  const { items: books, status, error } = useSelector((s) => s.books);
  const ubicacionesById = useSelector((s) => s.ubicaciones.byId);
  const ubStatus = useSelector((s) => s.ubicaciones.status);

  if (status === "loading" || ubStatus === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (status === "failed") return <Alert severity="error">{error}</Alert>;

  const mapper = (book) => mapLocationFromBook(book, ubicacionesById);

  return (
    <>
      <Box sx={{ px: 1 }}>
        <BookshelfGrid
          books={books}
          mapLocation={mapper}
          // ← pasamos callback para click
          onBookClick={(b) => setSelectedBook(b)}
        />
      </Box>

      <BookDetailsDialog
        book={selectedBook}
        open={Boolean(selectedBook)}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
