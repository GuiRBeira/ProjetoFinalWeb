// A importação correta para createTheme é de @mui/material/styles
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C026D3',
    },
    secondary: {
      main: '#E879F9',
    },
  },
  // O objeto 'components' contém todas as customizações, uma para cada componente
  components: {
    // Customização para estilos globais
    MuiCssBaseline: {
      styleOverrides: {
        // A regra do 'body' fica aqui dentro
        body: {
          backgroundColor: '#161616',
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
          backgroundSize: '20px 20px',
          backgroundRepeat: 'repeat',
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        // A regra do autocomplete também vem aqui dentro
        'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active': {
          '-webkit-box-shadow': '0 0 0 30px #2E2E2E inset !important',
          '-webkit-text-fill-color': '#EDE9FE !important',
          caretColor: '#fff',
          transition: 'background-color 5000s ease-in-out 0s',
        },
      },
    },
    // Customização para o OutlinedInput (irmão do MuiCssBaseline, não filho)
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& input': {
            color: '#EDE9FE',
          },
          '& .MuiSelect-select': {
            color: '#EDE9FE',
          },
          '& fieldset': {
            borderColor: '#C026D3',
          },
          '&:hover fieldset': {
            borderColor: '#D946EF',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#C026D3',
          },
        },
      },
    },
    // Customização para o InputLabel
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#A855F7',
          '&.Mui-focused': {
            color: '#D946EF',
          },
        },
      },
    },
    // Customização para o Select
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#A855F7',
        },
      },
    },
    // Customização para o Button
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