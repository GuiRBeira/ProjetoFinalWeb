import { AppBar, Toolbar, Typography, Box } from '@mui/material';
// 1. Importe o Outlet do react-router-dom
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            MestraPro
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* O conteúdo principal da página será renderizado aqui */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Adiciona um espaço no topo para não ficar atrás do AppBar */}
        <Toolbar /> 
        {/* 2. O Outlet é o placeholder onde o React Router vai renderizar a página da rota atual (Dashboard, Generate, etc.) */}
        <Outlet /> 
      </Box>
    </Box>
  );
}