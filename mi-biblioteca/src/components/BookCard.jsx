import { Card, CardContent, Typography } from "@mui/material";

export default function BookCard({ book, onClick }) {
  const id     = book.idLibro ?? book.id ?? "–";
  const title  = book.titulo ?? book.title ?? "Sin título";
  const author = Array.isArray(book.autores)
    ? book.autores.join(", ")
    : (book.autor ?? "");

  return (
    <Card
      variant="outlined"
      sx={{
        minWidth: 180,
        cursor: onClick ? "pointer" : "default",  // <- cursor mano
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {title}
        </Typography>
        {author && (
          <Typography variant="caption" color="text.secondary" noWrap>
            {author}
          </Typography>
        )}
        <Typography variant="caption" color="text.disabled" noWrap>
          #{id}
        </Typography>
      </CardContent>
    </Card>
  );
}
