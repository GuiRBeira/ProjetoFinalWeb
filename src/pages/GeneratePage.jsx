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
    Paper, // Importe Paper para o box de resultado
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Importe useNavigate
import ReactMarkdown from 'react-markdown';

export default function GeneratePage() {
    const [classTopic, setClassTopic] = useState('');
    const [gradeLevel, setGradeLevel] = useState('');
    const [subject, setSubject] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [generatedPlan, setGeneratedPlan] = useState(''); // Renomeado de 'result' para 'generatedPlan'
    const navigate = useNavigate(); // Hook para navegação programática

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        setGeneratedPlan('');

        console.log({
            topic: classTopic,
            grade: gradeLevel,
            subject: subject,
        });

        // Simulação da chamada da API e geração do plano
        setTimeout(() => {
            setIsLoading(false);

            const planoDeAulaSimulado = `
### Plano de Aula Detalhado

---

**Tema:** **${classTopic || 'Tema Indefinido'}**
**Disciplina:** **${subject.charAt(0).toUpperCase() + subject.slice(1) || 'Disciplina Indefinida'}**
**Série/Ano:** **${gradeLevel || 'Série Indefinida'}**

**Objetivos:**
* Compreender os conceitos fundamentais de ${classTopic}.
* Desenvolver habilidades de análise crítica.
* Estimular a participação e o debate em sala de aula.

**Conteúdo:**
* Introdução a ${classTopic}
* Aspectos históricos e sociais (se aplicável)
* Exemplos práticos e aplicações

**Metodologia:**
1.  **Aquecimento (5 min):** Iniciar com uma pergunta provocativa ou imagem relacionada ao tema.
2.  **Explanação (20 min):** Apresentação do conteúdo principal com uso de slides.
3.  **Atividade em Grupo (15 min):** Os alunos se dividem em grupos para resolver um problema ou discutir um subtema.
4.  **Discussão e Fechamento (10 min):** Compartilhamento dos resultados e síntese da aula.

**Recursos:**
* Projetor e slides (Beamer)
* Quadro branco/lousa
* Materiais impressos (se necessário)
* Acesso à internet (para pesquisa rápida)

**Avaliação:**
* Participação em aula
* Entrega da atividade em grupo
* Perguntas e respostas ao final

**Observações:** Adaptar a complexidade do conteúdo à série e disciplina.
            `;
            setGeneratedPlan(planoDeAulaSimulado);
            setSnackbarMessage('Plano de aula gerado com sucesso!');
            setSnackbarOpen(true);
        }, 2000);
    };

    // Função para simular a geração do código LaTeX e navegar
    const handleGenerateSlides = () => {
        // Exemplo simples de código LaTeX baseado no plano gerado
        const simulatedLatex = `
\\documentclass{beamer}
\\usetheme{Madrid} % Um tema simples para Beamer

\\title{Plano de Aula: ${classTopic || 'Tema Indefinido'}}
\\author{MestraPro AI}
\\institute{Série: ${gradeLevel || 'Indefinida'}}
\\date{${new Date().toLocaleDateString('pt-BR')}}

\\begin{document}

\\frame{\\titlepage}

\\section*{Introdução}
\\begin{frame}{Introdução ao Tema}
  \\begin{itemize}
    \\item Tema Central: \\textbf{${classTopic || 'Tema Indefinido'}}
    \\item Disciplina: ${subject.charAt(0).toUpperCase() + subject.slice(1) || 'Indefinida'}
    \\item Nível: ${gradeLevel || 'Indefinido'}
  \\end{itemize}
\\end{frame}

\\section*{Objetivos da Aula}
\\begin{frame}{Objetivos de Aprendizagem}
  \\begin{itemize}
    \\item Compreender conceitos fundamentais.
    \\item Desenvolver análise crítica.
    \\item Estimular participação e debate.
  \\end{itemize}
\\end{frame}

\\section*{Metodologia e Recursos}
\\begin{frame}{Como Vamos Aprender?}
  \\begin{enumerate}
    \\item Aquecimento com pergunta provocativa.
    \\item Explanação com slides.
    \\item Atividade em Grupo.
    \\item Discussão e Fechamento.
  \\end{enumerate}
  \\textbf{Recursos:} Projetor, Quadro, Materiais Impressos.
\\end{frame}

\\begin{frame}{Próximos Passos}
  \\begin{itemize}
    \\item Gerar slides com IA (Beamer).
    \\item Revisar e baixar materiais.
    \\item Compartilhar com os alunos!
  \\end{itemize}
\\end{frame}

\\end{document}
        `;

        // Navega para a página de preview do Beamer, passando o LaTeX simulado
        navigate('/app/beamer-preview', { state: { generatedLatex: simulatedLatex, generatedPlan: generatedPlan } });
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
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#E879F9' },
                            '&:hover fieldset': { borderColor: '#D946EF' },
                            '&.Mui-focused fieldset': { borderColor: '#C026D3' },
                        },
                        '& .MuiInputLabel-root': { color: '#A855F7' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#D946EF' },
                        input: { color: '#EDE9FE' },
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
                            '& fieldset': { borderColor: '#E879F9' },
                            '&:hover fieldset': { borderColor: '#D946EF' },
                            '&.Mui-focused fieldset': { borderColor: '#C026D3' },
                        },
                        '& .MuiInputLabel-root': { color: '#A855F7' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#D946EF' },
                        input: { color: '#EDE9FE' },
                    }}
                />
                <FormControl
                    fullWidth
                    margin="normal"
                    required
                    disabled={isLoading}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#E879F9' },
                            '&:hover fieldset': { borderColor: '#D946EF' },
                            '&.Mui-focused fieldset': { borderColor: '#C026D3' },
                        },
                        '& .MuiInputLabel-root': { color: '#A855F7' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#D946EF' },
                        value: { color: '#EDE9FE' },
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

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGenerateSlides}
                            sx={{
                                padding: '10px 30px',
                                fontSize: '1rem',
                            }}
                        >
                            Gerar Slides (Beamer)
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
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: '#C026D3', // Fundo do snackbar com a cor primária
                        color: '#EDE9FE', // Texto do snackbar
                    }
                }}
            />
        </Container>
    );
}