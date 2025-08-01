import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { loading: false, error: null, snackbar: null },
  reducers: {
    setLoading: (s, a) => { s.loading = a.payload; },
    setError:   (s, a) => { s.error = a.payload; },
    setSnackbar:(s, a) => { s.snackbar = a.payload; },
  },
});

export const { setLoading, setError, setSnackbar } = uiSlice.actions;
export default uiSlice.reducer;
