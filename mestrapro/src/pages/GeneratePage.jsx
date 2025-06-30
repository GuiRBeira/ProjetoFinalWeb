import { useState } from 'react';
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
import { Link as RouterLink } from 'react-router-dom';
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
            // Faz a chamada POST para a sua API FastAPI que está rodando localmente
            const response = await axiosClient.post(
                '/api/v1/generate/lesson_plan'
                , requestData);
            // Pega o plano de aula da resposta da API e atualiza o estado
            setGeneratedPlan(response.data.plan);
            setSnackbarMessage('Plano de aula gerado com sucesso!');
            setSnackbarOpen(true);

        } catch (error) {
            // Se der algum erro na comunicação, mostre no console e no snackbar
            console.error("Erro ao chamar a API:", error);
            setSnackbarMessage('Erro ao se comunicar com o servidor. Verifique se a API está rodando.');
            setSnackbarOpen(true);
        } finally {
            // Independentemente de sucesso ou erro, pare o loading ao final
            setIsLoading(false);
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
                        border: '0.1rem solid #C026D3', // Use a cor primária para a borda
                        borderRadius: '1rem',
                        background: '#1E1E1E', // Um fundo um pouco diferente do principal para destaque
                        color: '#EDE9FE', // Cor do texto
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main' }}>
                        Plano de Aula Gerado
                    </Typography>
                    <ReactMarkdown>{generatedPlan}</ReactMarkdown>
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