// 1. Importe o 'useState' do React
import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Snackbar, Grid, Link } from '@mui/material';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // 4. Crie uma função para lidar com o envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new URLSearchParams();
    formData.append('username', email); // A API espera 'username' para o campo de e-mail
    formData.append('password', password);

    try {
      const response = await axiosClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      // 5. Se o login for bem-sucedido, a resposta conterá o token de acesso
      const accessToken = response.data.access_token;
      console.log("LOGIN BEM-SUCEDIDO! Token de acesso:", accessToken);

      // 6. Use a função 'login' do contexto para armazenar o token
      login(accessToken);
      // 7. Redirecione o usuário para o dashboard
      navigate('/app/dashboard');

      // Exibir snackbar de sucesso
      setSnackbarMessage('Login realizado com sucesso!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erro no login:", error);
      // Exibir snackbar de erro
      setSnackbarMessage('E-mail ou senha incorretos.');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        <Typography component="h1" variant="h5">
          Acessar MestraPro
        </Typography>

        {/* 5. Adicione o 'onSubmit' ao nosso formulário */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
          >
            Homepage
          </Button>
          <Button
            component={RouterLink}
            to="/app/dashboard"
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
          >
            Voltar para o Dashboard
          </Button>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Endereço de E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            // 3. Conecte o estado ao campo de email
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            // 3. Conecte o estado ao campo de senha
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            Entrar
          </Button>
          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid>
              <Link component={RouterLink} to="/register" variant="body2">
                Não tem uma conta? Cadastre-se
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
}

