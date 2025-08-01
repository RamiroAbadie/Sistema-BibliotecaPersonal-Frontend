import api from "./axiosInstance";

// ── Libros ────────────────────────────────────────────────────────────────
export const createBook = (payload)           => api.post("/api/libros", payload).then(r => r.data);
export const updateBook = (id, payload)       => api.put(`/api/libros/${id}`, payload).then(r => r.data);
export const getBook    = (id)                => api.get(`/api/libros/${id}`).then(r => r.data);

// ── Países ────────────────────────────────────────────────────────────────
export const createPais = (nombre)            => api.post("/api/paises",     { nombre }).then(r => r.data);

// ── Autores ───────────────────────────────────────────────────────────────
export const createAutor = ({ nombre, sexo, paisId }) =>
  api.post("/api/autores", { nombre, sexo, paisId }).then(r => r.data);

// ── Editoriales ───────────────────────────────────────────────────────────
export const createEditorial = ({ nombre, paisId }) =>
  api.post("/api/editoriales", { nombre, paisId }).then(r => r.data);
