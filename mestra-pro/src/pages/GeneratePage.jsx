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
    Snackbar 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// 1. Importe o ReactMarkdown (não se esqueça de rodar 'npm install react-markdown')
import ReactMarkdown from 'react-markdown';

export default function GeneratePage() {
    const [classTopic, setClassTopic] = useState('');
    const [gradeLevel, setGradeLevel] = useState('');
    const [subject, setSubject] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    // 2. Adicione um novo estado para guardar o resultado do plano de aula
    const [result, setResult] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        // 3. Limpe o resultado anterior antes de gerar um novo
        setResult(''); 

        console.log({
            topic: classTopic,
            grade: gradeLevel,
            subject: subject,
        });

        setTimeout(() => {
            setIsLoading(false);

            // 4. Crie o conteúdo do plano de aula em formato Markdown
            const planoDeAulaGerado = `
### Resultado da Simulação

---

#### Tema: ${classTopic || 'Tema não definido'}
#### Série: ${gradeLevel || 'Série não definida'}

* **Objetivo 1:** Fomentar a discussão inicial sobre o tema.
* **Atividade Sugerida:** Roda de conversa com perguntas norteadoras.
* **Recursos:** Lousa, giz e a participação dos alunos.
            `;
            // 5. Salve o plano de aula gerado no estado 'result'
            setResult(planoDeAulaGerado);

            setSnackbarMessage('Plano de aula gerado com sucesso!');
            setSnackbarOpen(true);
        }, 2000); 
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>
                Gerador de Plano de Aula
            </Typography>
            <Typography paragraph>
                Preencha os campos abaixo para que a inteligência artificial possa criar um plano de aula personalizado.
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                {/* O seu formulário continua exatamente igual aqui */}
                    <TextField
                    label="Tema da Aula"
                    variant="outlined"
                    fullWidth
                    required
                    margin="dense"
                    value={classTopic}
                    onChange={(e) => setClassTopic(e.target.value)}
                    disabled={isLoading}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#E879F9', // borda normal
                        },
                        '&:hover fieldset': {
                            borderColor: '#D946EF', // borda ao passar o mouse
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#C026D3', // borda ao focar
                        },
                        },
                        '& .MuiInputLabel-root': {
                        color: '#A855F7', // cor padrão da label
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                        color: '#D946EF', // cor da label ao focar
                        },
                        input: {
                        color: '#EDE9FE', // cor do texto digitado
                        },
                    }}
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
                    sx={{
                        '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#E879F9', // borda normal
                        },
                        '&:hover fieldset': {
                            borderColor: '#D946EF', // borda ao passar o mouse
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#C026D3', // borda ao focar
                        },
                        },
                        '& .MuiInputLabel-root': {
                        color: '#A855F7', // cor padrão da label
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                        color: '#D946EF', // cor da label ao focar
                        },
                        input: {
                        color: '#EDE9FE', // cor do texto digitado
                        },
                    }}
                    />
                <FormControl
                fullWidth
                margin="normal"
                required
                disabled={isLoading}
                sx={{
                        '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#E879F9', // borda normal
                        },
                        '&:hover fieldset': {
                            borderColor: '#D946EF', // borda ao passar o mouse
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#C026D3', // borda ao focar
                        },
                        },
                        '& .MuiInputLabel-root': {
                        color: '#A855F7', // cor padrão da label
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                        color: '#D946EF', // cor da label ao focar
                        },
                        value: {
                        color: '#EDE9FE', // cor do texto digitado
                        },
                }}
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
                    sx={{ mt: 3, mb: 2, }}
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

            {/* 6. Adicione este novo bloco para exibir o resultado */}
            {/* Ele só aparecerá se o estado 'result' não estiver vazio */}
            {result && (
                <Box sx={{ mt: 5, p: 3, border: '0.1rem solid magenta', borderRadius: '1rem', background: '#1E1E1E' }}>
                    <Typography variant="h5" gutterBottom>
                        Plano de Aula Gerado
                    </Typography>
                    <ReactMarkdown>{result}</ReactMarkdown>
                </Box>
            )}

            {/* O Snackbar é o último elemento para garantir que ele apareça sobre todo o conteúdo */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                // Adiciona um estilo para o Snackbar se adequar ao tema escuro
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Container>
    );
}