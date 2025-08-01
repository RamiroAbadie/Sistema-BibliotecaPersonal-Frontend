import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }} variant="h6">
          Mi Biblioteca
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">Inicio</Button>
          <Button color="inherit" component={RouterLink} to="/search">Buscar</Button>
          <Button color="inherit" component={RouterLink} to="/manage">Gestionar</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
