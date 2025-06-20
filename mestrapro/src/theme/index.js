import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: 'dark',
    // ADICIONE ESTE BLOCO PARA DEFINIR SUA COR PRIMÁRIA
    primary: {
      main: '#C026D3', // Defina o seu roxo de foco como a cor principal do site
    },
    // Opcional, mas bom para consistência
    secondary: {
      main: '#E879F9', // O roxo mais claro como cor secundária
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#161616',
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
          backgroundSize: '20px 20px',
          backgroundRepeat: 'repeat',
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',},
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // Cor do texto digitado
          '& input': {
            color: '#EDE9FE',
          },
          // Cor do texto selecionado no Select
          '& .MuiSelect-select': {
            color: '#EDE9FE',
          },
          '& fieldset': {
            borderColor: '#C026D3', // Borda padrão
          },
          '&:hover fieldset': {
            borderColor: '#D946EF', // Borda no hover
          },
          '&.Mui-focused fieldset': {
            borderColor: '#C026D3', // Borda no foco
          },
        },
      },
    },
    // REGRA GLOBAL PARA TODAS AS LABELS
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#A855F7', // Cor padrão
          '&.Mui-focused': {
            color: '#D946EF', // Cor no foco
          },
        },
      },
    },
    // REGRA GLOBAL PARA A SETA DO SELECT
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#A855F7',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'large',
      },
      styleOverrides: {
        contained: {
          backgroundColor: '#9333EA',
          '&:hover': {
            backgroundColor: '#7e22ce',
          },
        },
        outlined: {
          borderColor: '#9333EA',
          color: '#9333EA',
          '&:hover': {
            borderColor: '#7e22ce',
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
          },
        },
      },
    },
  },
});

export default theme;