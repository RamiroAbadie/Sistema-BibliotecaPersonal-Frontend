import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Chip,
  Typography,
} from "@mui/material";

export default function BookDetailsDialog({ book, open, onClose }) {
  if (!book) return null;

  const {
    idLibro,
    titulo,
    paginas,
    ubicacion,
    autores = [],
    generos = [],
    editoriales = [],
  } = book;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{titulo}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body2">
            <strong>ID:</strong> {idLibro}
          </Typography>
          <Typography variant="body2">
            <strong>Páginas:</strong> {paginas}
          </Typography>
          <Typography variant="body2">
            <strong>Ubicación:</strong> {ubicacion}
          </Typography>

          {autores.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Typography variant="body2" sx={{ mr: 1 }}>
                <strong>Autores:</strong>
              </Typography>
              {autores.map((a) => (
                <Chip key={a} label={a} size="small" />
              ))}
            </Stack>
          )}

          {generos.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Typography variant="body2" sx={{ mr: 1 }}>
                <strong>Géneros:</strong>
              </Typography>
              {generos.map((g) => (
                <Chip key={g} label={g} size="small" color="info" />
              ))}
            </Stack>
          )}

          {editoriales.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Typography variant="body2" sx={{ mr: 1 }}>
                <strong>Editoriales:</strong>
              </Typography>
              {editoriales.map((e) => (
                <Chip key={e} label={e} size="small" color="secondary" />
              ))}
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
