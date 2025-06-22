import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardActions, Button, Typography, CircularProgress, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function DashboardPage() {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}