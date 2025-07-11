import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/AppLayout';
import GeneratePage from './pages/GeneratePage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/app/gerar" element={<GeneratePage />} />
            <Route path="/app/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
//comentario aleatorio pra eu dar commit
export default App;