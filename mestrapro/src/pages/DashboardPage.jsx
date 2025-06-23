import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function DashboardPage() {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  useEffect(() => {
    // Simulando uma chamada à API para buscar planos de aula
    const fetchPlans = async () => {
      try {
        const response = await axiosClient.get(
          '/api/v1/lesson_plans/');
        setPlans(response.data);
      } catch (error) {
        console.error('Erro ao buscar planos de aula:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);
  // --- NOVA FUNÇÃO DE DOWNLOAD ---
  const handleDownload = async (planId, planTopic) => {
    try {
      const response = await axiosClient.get(
        `/api/v1/${planId}/download`,
        { responseType: 'blob' } // MUITO IMPORTANTE: diz ao axios para esperar um arquivo binário
      );
      // Cria uma URL temporária para o arquivo que veio na resposta
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Cria um link temporário na memória
      const link = document.createElement('a');
      link.href = url;

      // Define o nome do arquivo que será baixado
      const fileName = `plano_de_aula_${planTopic.replace(' ', '_').toLowerCase()}.pdf`;
      link.setAttribute('download', fileName);

      // Adiciona o link ao corpo do documento e "clica" nele programaticamente
      document.body.appendChild(link);
      link.click();

      // Remove o link temporário depois do download
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Erro ao baixar o PDF:", error);
      // Aqui você pode mostrar um snackbar de erro
    }
  };

  const handleDelete = (planId) => {
    setPlanToDelete(planId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setPlanToDelete(null);
  };

  const handleComfirmDelete = async () => {
    if (!planToDelete) return;

    try {
      await axiosClient.delete(`/api/v1/${planToDelete}/delete`);
      setPlans(plans.filter(plan => plan.id !== planToDelete));
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao excluir o plano de aula:', error);
      // Aqui você pode mostrar um snackbar de erro
    } finally {
      handleCloseDialog();
    }
  };

  // Continue dentro do DashboardPage.jsx

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Meus Planos de Aula
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid key={plan.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {plan.topic}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {plan.grade} - {plan.subject}
                  </Typography>
                </CardContent>
                <CardActions>
                  {/* O botão de download aponta diretamente para o endpoint da API */}
                  <Button
                    size="medium"
                    onClick={() => handleDownload(plan.id, plan.topic)}
                  >
                    Baixar PDF
                  </Button>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(plan.id)}
                    sx={{ marginLeft: 'auto' }}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
              <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
              >
                <DialogTitle>Confirmar Deleção</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Você tem certeza que quer deletar o plano de aula
                    <strong>"{planToDelete?.topic}"</strong>? Esta ação não pode ser desfeita.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancelar</Button>
                  <Button onClick={handleComfirmDelete} color="primary" autoFocus>
                    Deletar
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          ))}
          <Button
            component={RouterLink}
            to="/app/gerar"
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
          >
            Gerar Novo Plano de Aula
          </Button>
        </Grid>
      )}
    </Container>
  );
}