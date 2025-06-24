// src/pages/GeneratePage.jsx


import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Snackbar,
    Paper,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axiosClient from '../api/axiosClient';

export default function GeneratePage() {
    const [classTopic, setClassTopic] = useState('');
    const [gradeLevel, setGradeLevel] = useState('');
    const [subject, setSubject] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [generatedPlan, setGeneratedPlan] = useState('');
    const [isGeneratingSlides, setIsGeneratingSlides] = useState(false); // NOVO ESTADO DE LOADING
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setGeneratedPlan('');

        const requestData = {
            topic: classTopic,
            grade: gradeLevel,
            subject: subject,
        };
        try {
            const response = await axiosClient.post(
                '/api/v1/generate/lesson_plan'
                , requestData);
            setGeneratedPlan(response.data.plan);
            setSnackbarMessage('Plano de aula gerado com sucesso!');
            setSnackbarOpen(true);

        } catch (error) {
            console.error("Erro ao chamar a API:", error);
            setSnackbarMessage('Erro ao se comunicar com o servidor. Verifique se a API está rodando.');
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateSlides = async () => {
        if (!generatedPlan) {
            setSnackbarMessage('Primeiro, gere um plano de aula.');
            setSnackbarOpen(true);
            return;
        }

        setIsGeneratingSlides(true); // Ativa o loading
        try {
            // Chama a nova rota da API para gerar o código LaTeX
            const response = await axiosClient.post(
                '/api/v1/beamer/generate/beamer_from_plan',
                { content: generatedPlan } // Envia o plano de aula no corpo da requisição
            );

            const latexFromAI = response.data.latex_code;

            // Navega para a página de preview, passando o LaTeX real gerado pela IA
            navigate('/app/beamer-preview', {
                state: {
                    generatedLatex: latexFromAI,
                    generatedPlan: generatedPlan
                }
            });

        } catch (error) {
            console.error("Erro ao gerar slides com IA:", error);
            setSnackbarMessage('Erro ao se comunicar com a IA para gerar os slides.');
            setSnackbarOpen(true);
        } finally {
            setIsGeneratingSlides(false); // Desativa o loading
        }
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>
                Gerador de Plano de Aula
            </Typography>
            <Typography>
                Preencha os campos abaixo para que a inteligência artificial possa criar um plano de aula personalizado.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                    label="Tema da Aula"
                    variant="outlined"
                    fullWidth
                    required
                    margin="dense"
                    value={classTopic}
                    onChange={(e) => setClassTopic(e.target.value)}
                    disabled={isLoading}
                />
                <TextField
                    label="Série ou Ano"
                    variant="outlined"
                    fullWidth
                    required
                    margin="dense"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    disabled={isLoading}
                />
                <FormControl
                    fullWidth
                    margin="normal"
                    required
                    disabled={isLoading}
                >
                    <InputLabel id="subject-select-label">Disciplina</InputLabel>
                    <Select
                        labelId="subject-select-label"
                        id="subject-select"
                        value={subject}
                        label="Disciplina"
                        onChange={(e) => setSubject(e.target.value)}
                    >
                        <MenuItem value={'matematica'}>Matemática</MenuItem>
                        <MenuItem value={'portugues'}>Português</MenuItem>
                        <MenuItem value={'historia'}>História</MenuItem>
                        <MenuItem value={'ciencias'}>Ciências</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Gerar Plano com IA'}
                </Button>
                <Button
                    component={RouterLink}
                    to="/app/dashboard"
                    variant="outlined"
                    fullWidth
                    disabled={isLoading}
                >
                    Voltar para o Dashboard
                </Button>
            </Box>

            {generatedPlan && (
                <Paper
                    elevation={2}
                    sx={{
                        mt: 5,
                        p: 3,
                        border: '0.1rem solid #C026D3',
                        borderRadius: '1rem',
                        background: '#1E1E1E',
                        color: '#EDE9FE',
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main' }}>
                        Plano de Aula Gerado
                    </Typography>
                    <ReactMarkdown>{generatedPlan}</ReactMarkdown>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGenerateSlides}
                            disabled={isLoading || isGeneratingSlides}
                            sx={{
                                padding: '10px 30px',
                                fontSize: '1rem',
                            }}
                        >
                            {isGeneratingSlides ?
                                <CircularProgress size={26} color="inherit" /> :
                                'Gerar Slides (Beamer)'
                            }
                        </Button>
                    </Box>
                </Paper>
            )}

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