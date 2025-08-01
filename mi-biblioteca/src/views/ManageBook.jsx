import { useEffect, useState } from "react";
import {
  Box, Button, Stack, TextField, Autocomplete, Typography,
  CircularProgress, Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchBooks } from "../redux/slices/booksSlice";
import api from "../utils/axiosInstance";
import {
  createBook, updateBook, getBook,
  createAutor, createEditorial, createPais,
} from "../utils/bookApi";
import AddEntityDialog from "../components/AddEntityDialog";

export default function ManageBook() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ── Catálogos ────────────────────────────────────────────────────────────
  const [catUbic, setCatUbic] = useState([]);
  const [catAut,  setCatAut ] = useState([]);
  const [catGen,  setCatGen ] = useState([]);
  const [catEd,   setCatEd  ] = useState([]);
  const [catPais, setCatPais] = useState([]);

  // ── Form ─────────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    titulo: "", paginas: "", ubicacion: null,
    autores: [], generos: [], editoriales: [],
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // ── Diálogo de creación de autor/editorial ───────────────────────────────
  const [dlg, setDlg] = useState({ open: false, type: "", initial: "" });

  // ── Cargar catálogos & libro ─────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [uRes, aRes, gRes, eRes, pRes] = await Promise.all([
          api.get("/api/ubicaciones"),
          api.get("/api/autores"),
          api.get("/api/generos"),
          api.get("/api/editoriales"),
          api.get("/api/paises"),
        ]);
        setCatUbic(uRes.data);
        setCatAut(aRes.data);
        setCatGen(gRes.data);
        setCatEd (eRes.data);
        setCatPais(pRes.data);

        if (isEdit) {
          const data = await getBook(id);
          setForm({
            titulo: data.titulo,
            paginas: String(data.paginas ?? ""),
            ubicacion: uRes.data.find(u => u.referencia === data.ubicacion) ?? null,
            autores: (data.autores ?? []).map(n => aRes.data.find(a => a.nombre === n)).filter(Boolean),
            generos: (data.generos ?? []).map(n => gRes.data.find(g => g.descripcion === n)).filter(Boolean),
            editoriales: (data.editoriales ?? []).map(n => eRes.data.find(e => e.nombre === n)).filter(Boolean),
          });
        }
      } catch (err) {
        console.error(err);
        setError("Error cargando catálogos");
      }
    })();
  }, [id, isEdit]);

  // ── Abrir diálogo para crear entidad ─────────────────────────────────────
  const openAddDialog = (type, initial) =>
    setDlg({ open: true, type, initial });

  // ── Cerrar diálogo y crear entidad si corresponde ────────────────────────
  const handleDialogClose = async (result) => {
    setDlg({ ...dlg, open: false });
    if (!result) return;

    try {
      // País (crear si no existe)
      let paisObj = catPais.find(p => p.nombre === result.pais.nombre);
      if (!paisObj) {
        paisObj = await createPais(result.pais.nombre);
        setCatPais(prev => [...prev, paisObj]);
      }

      if (dlg.type === "autor") {
        const nuevo = await createAutor({ nombre: result.nombre, sexo: null, paisId: paisObj.idPais });
        setCatAut(prev => [...prev, nuevo]);
        setForm(f => ({ ...f, autores: [...f.autores, nuevo] }));
      } else {
        const nuevo = await createEditorial({ nombre: result.nombre, paisId: paisObj.idPais });
        setCatEd(prev => [...prev, nuevo]);
        setForm(f => ({ ...f, editoriales: [...f.editoriales, nuevo] }));
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la entidad");
    }
  };

  // ── Guardar libro ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar ubicacion elegida
    if (!form.ubicacion) { setError("Elige una ubicación"); return; }

    // Si quedan strings libres, forzar creación antes de guardar
    const pendAutor  = form.autores.find(x => typeof x === "string");
    if (pendAutor) { openAddDialog("autor", pendAutor); return; }

    const pendEdit   = form.editoriales.find(x => typeof x === "string");
    if (pendEdit)  { openAddDialog("editorial", pendEdit); return; }

    const payload = {
      titulo: form.titulo,
      paginas: Number(form.paginas) || 0,
      ubicacionId: form.ubicacion.idUbicacion,
      autoresIds:     form.autores.map(a => a.idAutor),
      generosIds:     form.generos.map(g => g.idGenero),
      editorialesIds: form.editoriales.map(ed => ed.idEditorial),
    };

    try {
      setLoading(true);
      if (isEdit) await updateBook(id, payload);
      else        await createBook(payload);
      dispatch(fetchBooks());
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el libro");
    } finally {
      setLoading(false);
    }
  };

  // ── Loading inicial / error ──────────────────────────────────────────────
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!catUbic.length)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  // ── UI principal ─────────────────────────────────────────────────────────
  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {isEdit ? "Editar libro" : "Nuevo libro"}
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Título"
            value={form.titulo}
            onChange={(e) => setForm(f => ({ ...f, titulo: e.target.value }))}
            required
          />

          <TextField
            label="Páginas"
            type="number"
            value={form.paginas}
            onChange={(e) => setForm(f => ({ ...f, paginas: e.target.value }))}
            required
          />

          {/* Ubicación */}
          <Autocomplete
            options={catUbic}
            getOptionLabel={(o) => o.referencia}
            isOptionEqualToValue={(o,v) => o.idUbicacion === v.idUbicacion}
            value={form.ubicacion}
            onChange={(_, v) => setForm(f => ({ ...f, ubicacion: v }))}
            renderInput={(p) => <TextField {...p} label="Ubicación" required />}
          />

          {/* Autores */}
          <Autocomplete
            multiple
            freeSolo
            options={catAut}
            getOptionLabel={(o) => typeof o === "string" ? o : o.nombre}
            isOptionEqualToValue={(o,v) => o.idAutor === v.idAutor}
            value={form.autores}
            onChange={(_, v) => {
              const text = v.find(x => typeof x === "string");
              if (text) openAddDialog("autor", text);
              setForm(f => ({ ...f, autores: v.filter(x => typeof x !== "string") }));
            }}
            renderInput={(p) => <TextField {...p} label="Autores" placeholder="Elegir o escribir..." />}
          />

          {/* Géneros */}
          <Autocomplete
            multiple
            options={catGen}
            getOptionLabel={(o) => o.descripcion}
            isOptionEqualToValue={(o,v) => o.idGenero === v.idGenero}
            value={form.generos}
            onChange={(_, v) => setForm(f => ({ ...f, generos: v }))}
            renderInput={(p) => <TextField {...p} label="Géneros" />}
          />

          {/* Editoriales */}
          <Autocomplete
            multiple
            freeSolo
            options={catEd}
            getOptionLabel={(o) => typeof o === "string" ? o : o.nombre}
            isOptionEqualToValue={(o,v) => o.idEditorial === v.idEditorial}
            value={form.editoriales}
            onChange={(_, v) => {
              const text = v.find(x => typeof x === "string");
              if (text) openAddDialog("editorial", text);
              setForm(f => ({ ...f, editoriales: v.filter(x => typeof x !== "string") }));
            }}
            renderInput={(p) => <TextField {...p} label="Editoriales" placeholder="Elegir o escribir..." />}
          />

          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={loading}>
              {isEdit ? "Guardar cambios" : "Crear libro"}
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>Cancelar</Button>
          </Stack>
        </Stack>
      </Box>

      {/* Diálogo para autor / editorial nuevos */}
      <AddEntityDialog
        open={dlg.open}
        title={dlg.type === "autor" ? "Nuevo autor" : "Nueva editorial"}
        initialName={dlg.initial}
        paises={catPais}
        onClose={handleDialogClose}
      />
    </>
  );
}
