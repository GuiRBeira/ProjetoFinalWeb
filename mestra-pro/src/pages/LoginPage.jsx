// 1. Importe o 'useState' do React
import { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';

export default function LoginPage() {
  // 2. Crie os estados para email e senha
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 4. Crie uma função para lidar com o envio do formulário
  const handleSubmit = (event) => {
    // Previne o comportamento padrão do formulário, que é recarregar a página
    event.preventDefault();

    // Por enquanto, vamos apenas mostrar os dados no console
    console.log({
      email: email,
      password: password,
    });
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
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}