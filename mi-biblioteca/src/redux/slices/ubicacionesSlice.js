import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

export const fetchUbicaciones = createAsyncThunk(
  "ubicaciones/fetchAll",
  async () => {
    const { data } = await api.get("/api/ubicaciones");
    return data; // [{ idUbicacion, referencia }, ...]
  }
);

const ubicacionesSlice = createSlice({
  name: "ubicaciones",
  initialState: { items: [], byId: {}, status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchUbicaciones.pending,   (s) => { s.status = "loading"; })
     .addCase(fetchUbicaciones.fulfilled, (s, a) => {
       s.status = "succeeded";
       s.items = a.payload;
       s.byId = Object.fromEntries(a.payload.map(u => [u.idUbicacion, u]));
     })
     .addCase(fetchUbicaciones.rejected,  (s, a) => { s.status = "failed"; s.error = a.error.message; });
  },
});

export default ubicacionesSlice.reducer;
