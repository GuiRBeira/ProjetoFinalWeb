// Em: src/pages/RegisterPage.jsx

import { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Snackbar, Grid, Link, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
    const [name, setName] = useState(''); // Estado para o nome
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Estado para confirmar a senha
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // --- INÍCIO DAS VALIDAÇÕES DO FRONT-END ---

        // 1. Validação de Confirmação de Senha
        if (password !== confirmPassword) {
            setSnackbarMessage('As senhas não coincidem!');
            setSnackbarOpen(true);
            return; // Para a execução se as senhas forem diferentes
        }

        // 2. Validação de Força da Senha (Exemplo simples)
        if (password.length < 8) {
            setSnackbarMessage('A senha deve ter pelo menos 8 caracteres.');
            setSnackbarOpen(true);
            return;
        }

        // 3. Validação de Email (Regex simples para exemplo)
        const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;
        if (!emailRegex.test(email)) {
            setSnackbarMessage('Por favor, insira um formato de e-mail válido.');
            setSnackbarOpen(true);
            return;
        }

        // --- FIM DAS VALIDAÇÕES ---

        setIsLoading(true);
        const requestData = { name, email, password };

        try {
            await axios.post('https://mestra-pro-api.onrender.com/auth/register', requestData);
            setSnackbarMessage('Cadastro realizado com sucesso! Redirecionando para o login...');
            setSnackbarOpen(true);

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            // ... (o resto da sua lógica de erro continua aqui)
            console.error("Erro no cadastro:", error);
            const message = error.response?.data?.detail || 'Erro ao realizar o cadastro.';
            setSnackbarMessage(message);
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Criar Conta na MestraPro
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        label="Nome Completo"
                        required fullWidth margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                    />
                    <TextField
                        label="Endereço de E-mail"
                        type="email"
                        required fullWidth margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                    <TextField
                        label="Senha"
                        type={showPassword ? 'text' : 'password'}
                        required
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Confirme sua senha"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required fullWidth margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
                        {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid>
                            <Link component={RouterLink} to="/login" variant="body2">
                                Já tem uma conta? Faça login
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