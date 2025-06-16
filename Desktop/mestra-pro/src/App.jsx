import { BrowserRouter, Routes, Route } from 'react-router-dom';
// 1. FALTAVAM ESTES IMPORTS
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/AppLayout'; // Importe o novo layout
import GeneratePage from './pages/GeneratePage'; // Importe a página de geração
import DashboardPage from './pages/DashboardPage'; // Importe a página do dashboard

// Lembre-se de importar as outras páginas aqui também quando for usá-las
// import DashboardPage from './pages/DashboardPage'; 
// import GeneratePage from './pages/GeneratePage';

// É uma boa prática definir o tema FORA do componente App,
// para que ele não seja recriado toda vez que o componente renderizar.

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#161616',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
          backgroundSize: '20px 20px',
          backgroundRepeat: 'repeat',
          color: '#dfe4e9', 
        },
      },
    },
  },
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas que não usam o AppLayout */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas privadas que USAM o AppLayout compartilhado */}
          <Route element={<AppLayout />}>
            <Route path="/app/dashboard" element={<DashboardPage />} />
            <Route path="/app/gerar" element={<GeneratePage />} />
            {/* Todas as futuras rotas da aplicação podem ir aqui dentro */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;