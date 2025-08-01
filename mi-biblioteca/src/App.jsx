import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Container } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchBooks } from "./redux/slices/booksSlice";
import { fetchUbicaciones } from "./redux/slices/ubicacionesSlice";

import NavBar from "./components/NavBar";
import Home from "./views/Home";
import Search from "./views/Search";
import ManageBook from "./views/ManageBook";

const theme = createTheme({ palette: { mode: "light" } });

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUbicaciones());
    dispatch(fetchBooks());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/manage" element={<ManageBook />} /> {/*crear libro*/}
            <Route path="/manage/:id" element={<ManageBook />} /> {/*editar libro*/}
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}
