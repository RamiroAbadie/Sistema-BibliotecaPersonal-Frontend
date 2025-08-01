import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

export const fetchBooks = createAsyncThunk("books/fetchAll", async () => {
  const { data } = await api.get("/api/libros");
  return data; // ajustamos el mapper para sacar ubicacion desde aquí
});

export const updateBookLocation = createAsyncThunk(
  "books/updateLocation",
  async ({ id, partial }) => {
    // Ejemplo de partial: { ubicacionId: 120 }
    const { data } = await api.put(`/api/libros/${id}`, partial);
    return data;
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchBooks.pending,   (s) => { s.status = "loading"; })
     .addCase(fetchBooks.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; })
     .addCase(fetchBooks.rejected,  (s, a) => { s.status = "failed"; s.error = a.error.message; })
     .addCase(updateBookLocation.fulfilled, (s, a) => {
        const updated = a.payload;
        const i = s.items.findIndex(x => x.id === (updated.id ?? updated.idLibro));
        if (i !== -1) s.items[i] = updated;
     });
  },
});

export default booksSlice.reducer;
