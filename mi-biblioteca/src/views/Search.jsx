import { useEffect, useMemo, useState } from "react";
import {
  TextField,
  Box,
  Stack,
  Autocomplete,
  Slider,
  Typography,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
import BookCard from "../components/BookCard";
import BookDetailsDialog from "../components/BookDetailsDialog";
import api from "../utils/axiosInstance";

export default function Search() {
  // ── Estado local ───────────────────────────────────────────────────────────
  const [q, setQ] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  const [genres, setGenres] = useState([]);          // ["Política", ...]
  const [editoriales, setEditoriales] = useState([]);// ["Planeta", ...]
  const [selGenres, setSelGenres] = useState([]);    // []
  const [selEdis, setSelEdis] = useState([]);        // []
  const [pageRange, setPageRange] = useState([0, 2000]);

  // ── Libros desde Redux ─────────────────────────────────────────────────────
  const books = useSelector((s) => s.books.items);

  // ── Cargar catálogos de filtros una sola vez ───────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [gRes, eRes] = await Promise.all([
          api.get("/api/generos"),
          api.get("/api/editoriales"),
        ]);
        setGenres(gRes.data.map((g) => g.descripcion).sort());
        setEditoriales(eRes.data.map((e) => e.nombre).sort());
      } catch (err) {
        console.error("Error cargando filtros", err);
      }
    })();
  }, []);

  // ── Calcular página mín/máx según los libros ───────────────────────────────
  const [minPages, maxPages] = useMemo(() => {
    if (!books.length) return [0, 2000];
    const pages = books.map((b) => b.paginas ?? 0);
    return [Math.min(...pages), Math.max(...pages)];
  }, [books]);

  // Asegurar rango inicial coherente
  useEffect(() => setPageRange([minPages, maxPages]), [minPages, maxPages]);

  // ── Filtrado memoizado ─────────────────────────────────────────────────────
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();

    return books.filter((b) => {
      // Texto (título o autor)
      const matchText =
        !term ||
        (b.titulo ?? "").toLowerCase().includes(term) ||
        (Array.isArray(b.autores)
          ? b.autores.join(" ").toLowerCase().includes(term)
          : "");

      // Género
      const matchGenre =
        !selGenres.length ||
        (Array.isArray(b.generos) &&
          b.generos.some((g) => selGenres.includes(g)));

      // Editorial
      const matchEdit =
        !selEdis.length ||
        (Array.isArray(b.editoriales) &&
          b.editoriales.some((e) => selEdis.includes(e)));

      // Páginas
      const pags = b.paginas ?? 0;
      const matchPages = pags >= pageRange[0] && pags <= pageRange[1];

      return matchText && matchGenre && matchEdit && matchPages;
    });
  }, [books, q, selGenres, selEdis, pageRange]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Stack spacing={2}>
        {/* ── Campo de búsqueda ─────────────────────────────────────── */}
        <TextField
          label="Buscar por título o autor"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />

        {/* ── Filtros ──────────────────────────────────────────────── */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Autocomplete
            multiple
            size="small"
            options={genres}
            value={selGenres}
            onChange={(_, v) => setSelGenres(v)}
            renderInput={(params) => (
              <TextField {...params} label="Géneros" placeholder="Todos" />
            )}
            sx={{ minWidth: 220 }}
          />

          <Autocomplete
            multiple
            size="small"
            options={editoriales}
            value={selEdis}
            onChange={(_, v) => setSelEdis(v)}
            renderInput={(params) => (
              <TextField {...params} label="Editoriales" placeholder="Todas" />
            )}
            sx={{ minWidth: 220 }}
          />

          <Box sx={{ flexGrow: 1, px: 1 }}>
            <Typography variant="caption">
              Páginas: {pageRange[0]} – {pageRange[1]}
            </Typography>
            <Slider
              value={pageRange}
              onChange={(_, v) => setPageRange(v)}
              min={minPages}
              max={maxPages}
              sx={{ mt: 1 }}
            />
          </Box>
        </Stack>

        <Divider />

        {/* ── Resultados ────────────────────────────────────────────── */}
        <Typography variant="body2">
          {results.length} resultado{results.length !== 1 && "s"}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {results.map((b, idx) => (
            <BookCard
              key={b.idLibro ?? b.id ?? b.isbn ?? `${b.titulo}-${idx}`}
              book={b}
              onClick={() => setSelectedBook(b)}
            />
          ))}
        </Box>
      </Stack>

      {/* ── Dialogo de detalles ────────────────────────────────────── */}
      <BookDetailsDialog
        book={selectedBook}
        open={Boolean(selectedBook)}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
