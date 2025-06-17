import { Container, Box, Typography, Button } from '@mui/material';
// 1. Importe o 'Link' para criar links de navegação
import { Link as RouterLink } from 'react-router-dom';

export default function HomePage() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          my: 4, // my = margin no eixo y (top e bottom)
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh', // Ocupa quase toda a altura da tela
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          MestraPro
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          A sua assistente de IA para criar planos de aula e materiais didáticos incríveis.
        </Typography>
        <Button
          // 2. Use o componente 'RouterLink' e a prop 'to' para definir o destino
          component={RouterLink}
          to="/login"
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
        >
          Começar Agora
        </Button>
      </Box>
    </Container>
  );
}