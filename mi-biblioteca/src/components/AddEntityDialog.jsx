import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Stack,
} from "@mui/material";
import { useState } from "react";

/**
 * props:
 *  open           bool
 *  onClose(result)  result = { nombre, paisObj } | null
 *  title          string
 *  initialName    string
 *  paises         [{idPais,nombre}]
 */
export default function AddEntityDialog({ open, onClose, title, initialName, paises }) {
  const [nombre, setNombre] = useState(initialName);
  const [pais, setPais]     = useState(null);

  const disabled = !nombre.trim() || !pais;

  return (
    <Dialog open={open} onClose={() => onClose(null)} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoFocus
          />

          <Autocomplete
            options={paises}
            getOptionLabel={(o) => o.nombre}
            isOptionEqualToValue={(o, v) => o.idPais === v.idPais}
            value={pais}
            onChange={(_, v) => setPais(v)}
            renderInput={(p) => <TextField {...p} label="País" />}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(null)}>Cancelar</Button>
        <Button disabled={disabled} onClick={() => onClose({ nombre: nombre.trim(), pais })}>
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}
