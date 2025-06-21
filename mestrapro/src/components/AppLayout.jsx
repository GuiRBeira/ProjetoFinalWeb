// Em: src/components/AppLayout.jsx

import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importe nosso hook de autenticação

export default function AppLayout() {
    // Pega o estado de autenticação e a função de logout do nosso contexto
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Limpa o token do localStorage e do estado
        navigate('/login'); // Redireciona o usuário para a página de login
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        MestraPro
                    </Typography>

                    {/* AQUI ESTÁ A LÓGICA CONDICIONAL */}
                    {isAuthenticated ? (
                        // Se o usuário ESTIVER autenticado, mostre isso:
                        <>
                            {/* No futuro, podemos buscar e mostrar o nome do usuário aqui */}
                            <Typography sx={{ mr: 2 }}>Olá, Professor!</Typography>
                            <Button color="inherit" onClick={handleLogout}>
                                Sair
                            </Button>
                        </>
                    ) : (
                        // Se o usuário NÃO ESTIVER autenticado, mostre isso:
                        <>
                            <Button color="inherit" component={RouterLink} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={RouterLink} to="/register">
                                Cadastrar
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}