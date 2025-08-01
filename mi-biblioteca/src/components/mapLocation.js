// Mapea la referencia ("BR1->Estante 2") a { libraryId, shelfIndex }
const LIBRARY_PREFIX_MAP = {
  BR1:        "ramiro1",
  BR2:        "ramiro2",
  BPEscalera: "oficina3",
  BPOficina:  "oficina10",
};

function parseReferencia(referencia) {
  if (!referencia || typeof referencia !== "string") return null;

  const [rawPrefix, rawShelf] = referencia.split("->");
  const libraryId = LIBRARY_PREFIX_MAP[rawPrefix];
  if (!libraryId) return null;

  const m = rawShelf?.match(/Estante\s+(\d+)/i);
  if (!m) return null;

  return { libraryId, shelfIndex: parseInt(m[1], 10) };
}

/**
 * Devuelve { libraryId, shelfIndex } a partir del libro.
 * Casos contemplados:
 *  - book.ubicacion === "BR1->Estante 2"   (string directo)
 *  - book.ubicacion?.referencia            (objeto con string)
 *  - book.ubicacionId -> ubicacionesById[id].referencia
 */
export function mapLocationFromBook(book, ubicacionesById) {
  if (!book) return null;

  const ref =
    // caso string directo
    (typeof book.ubicacion === "string" && book.ubicacion) ? book.ubicacion :
    // caso objeto { referencia: "" }
    book.ubicacion?.referencia ??
    // caso por id
    (book.ubicacionId && ubicacionesById?.[book.ubicacionId]?.referencia);

  return parseReferencia(ref);
}
