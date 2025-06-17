import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, TextField, Stack } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import ReactMarkdown from 'react-markdown';

function BeamerPreviewPage() {
  console.log("BeamerPreviewPage está tentando renderizar!");  
  const location = useLocation();
  const generatedLatex = location.state?.generatedLatex || '';
  const generatedPlan = location.state?.generatedPlan || '';

  const [currentLatexDisplay, setCurrentLatexDisplay] = useState('');
  const [slideContent, setSlideContent] = useState('Nenhum slide para pré-visualizar.');

  useEffect(() => {
    if (generatedLatex) {
      setCurrentLatexDisplay(generatedLatex);
    }
    if (generatedPlan) {
      const planTitleMatch = generatedPlan.match(/Tema:\s*\*\*(.*?)\*\*/);
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

  const handleDownloadSlide = () => {
    console.log("Ação: Baixar Slide (PDF) clicada!");
    alert("Baixar Slide (PDF) (Funcionalidade em desenvolvimento)");
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

  return (
    <AppLayout>
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
              Código LaTeX Gerado (Simulação)
            </Typography>
            <TextField
              label="Código LaTeX"
              multiline
              rows={20}
              value={currentLatexDisplay}
              onChange={(e) => setCurrentLatexDisplay(e.target.value)} // <-- CORRIGIDO AQUI!
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
                    color="primary"
                    onClick={handleGenerateNewLatex}
                    sx={{ flexGrow: 1 }}
                >
                    Gerar Novo Código LaTeX
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownloadSlide}
                    sx={{ flexGrow: 1 }}
                >
                    Baixar Slide (PDF)
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
    </AppLayout>
  );
}

export default BeamerPreviewPage;