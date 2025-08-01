import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./slices/booksSlice";
import ubicacionesReducer from "./slices/ubicacionesSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    books:        booksReducer,
    ubicaciones:  ubicacionesReducer,
    ui:           uiReducer,
  },
});
