// src/pages/BeamerPreviewPage.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, TextField, Stack, CircularProgress } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function BeamerPreviewPage() {
  const location = useLocation();
  const generatedLatex = location.state?.generatedLatex || '';
  const generatedPlan = location.state?.generatedPlan || '';

  const [currentLatexDisplay, setCurrentLatexDisplay] = useState('');
  const [slideContent, setSlideContent] = useState('Nenhum slide para pré-visualizar.');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (generatedLatex) {
      setCurrentLatexDisplay(generatedLatex);
    }
    if (generatedPlan) {
      const planTitleMatch = generatedPlan.match(/\*\*Tema da Aula:\*\*\s*(.*)/);
      if (planTitleMatch && planTitleMatch[1]) {
        setSlideContent(`Tema: ${planTitleMatch[1].trim()}`);
      } else {
        setSlideContent('Conteúdo do Slide (Plano de aula sem tema detectado)');
      }
    }
  }, [generatedLatex, generatedPlan]);

  const handleGenerateNewLatex = () => {
    console.log("Ação: Gerar Novo Código LaTeX clicada!");
    alert("Gerar Novo Código LaTeX (Funcionalidade em desenvolvimento)");
  };

  const handleDownloadSlide = async () => {
    if (!currentLatexDisplay) {
        alert("Não há código LaTeX para gerar o PDF.");
        return;
    }
    setIsDownloading(true);
    try {
        const response = await axiosClient.post(
            '/api/v1/beamer/generate/beamer_pdf',
            { latex_code: currentLatexDisplay },
            { responseType: 'blob' }
        );

        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        const fileName = `slides_mestrapro_${new Date().getTime()}.pdf`;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Erro ao baixar o PDF dos slides:", error);
        const errorMessage = error.response?.data ? await error.response.data.text() : "Erro desconhecido.";
        alert(`Falha ao gerar o PDF. Verifique o console ou o código LaTeX. Detalhe: ${errorMessage}`);
    } finally {
        setIsDownloading(false);
    }
  };

  const renderSimulatedSlide = () => {
    return (
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          aspectRatio: '16 / 9',
          backgroundColor: '#30103A',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          border: '2px solid #E879F9',
          p: 2,
          textAlign: 'center',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <Typography variant="h5" sx={{ color: '#E879F9', mb: 1 }}>
          Slide Beamer Simulado
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
          {slideContent}
        </Typography>
        <Typography variant="caption" sx={{ mt: 'auto', color: 'rgba(255, 255, 255, 0.7)' }}>
          (Visualizador em Construção - MestraPro)
        </Typography>
      </Paper>
    );
  };
  
  // A função não se envolve mais com <AppLayout>
  return (
      <Box
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          maxWidth: 1200,
          margin: 'auto',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          minHeight: '80vh',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
          Visualização e Geração de Slides Beamer
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
              Código LaTeX Gerado (Editável)
            </Typography>
            <TextField
              label="Código LaTeX"
              multiline
              rows={20}
              value={currentLatexDisplay}
              onChange={(e) => setCurrentLatexDisplay(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#242424',
                  '& fieldset': { borderColor: '#C026D3' },
                  '&:hover fieldset': { borderColor: '#D946EF' },
                  '&.Mui-focused fieldset': { borderColor: '#C026D3' },
                },
                '& .MuiInputLabel-root': { color: '#A855F7' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D946EF' },
                '& .MuiInputBase-input': { color: '#EDE9FE', fontFamily: 'monospace' },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
              Pré-visualização do Slide
            </Typography>
            {renderSimulatedSlide()}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleGenerateNewLatex}
                    sx={{ flexGrow: 1 }}
                >
                    Gerar com IA (Em breve)
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownloadSlide}
                    disabled={isDownloading}
                    sx={{ flexGrow: 1 }}
                >
                    {isDownloading ? <CircularProgress size={24} color="inherit" /> : 'Baixar Slide (PDF)'}
                </Button>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            component={RouterLink}
            to="/app/dashboard"
            variant="outlined"
            size="large"
          >
            Voltar para o Dashboard
          </Button>
        </Box>
      </Box>
  );
}

export default BeamerPreviewPage;