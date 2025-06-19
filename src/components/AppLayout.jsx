import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material'; // Importe Button
import { Outlet, Link as RouterLink } from 'react-router-dom'; // Importe Link as RouterLink

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> {/* Adicionado flexDirection e minHeight */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#1F1F1F' }} // Adicionei cor de fundo para a AppBar
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#E879F9' }}>
            <Button color="inherit" component={RouterLink} to="/">
            MestraPro
          </Button>
          </Typography>
          {/* Adicionando botões de navegação para facilitar durante o desenvolvimento */}
          <Button color="inherit" component={RouterLink} to="/app/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/app/gerar">
            Gerar Plano
          </Button>
          <Button color="inherit" component={RouterLink} to="/app/beamer-preview">
            Preview Beamer
          </Button>
          <Button color="inherit" component={RouterLink} to="/login">
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}