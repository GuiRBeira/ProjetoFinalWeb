import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function DashboardPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Conteúdo principal da página */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bem-vindo(a) ao seu Dashboard!
        </Typography>
        <Typography variant="body1">
          Aqui você pode gerenciar seus planos de aula e criar novos materiais com o poder da Inteligência Artificial.
        </Typography>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            component={RouterLink}
            to="/app/gerar" // Link para a página de geração
            variant="contained"
            size="large"
          >
            Gerar Novo Plano de Aula
          </Button>
        </Box>
      </Container>
    </Box>
  );
}