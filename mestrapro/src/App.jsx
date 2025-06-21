import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Certifique-se de que o caminho para o tema está correto

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/AppLayout';
import GeneratePage from './pages/GeneratePage';
import DashboardPage from './pages/DashboardPage';
import BeamerPreviewPage from './pages/BeamerPreviewPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
            <Route path="/app/dashboard" element={<DashboardPage />} />
            <Route path="/app/gerar" element={<GeneratePage />} />
            <Route path="/app/beamer-preview" element={<BeamerPreviewPage />} />
            <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;