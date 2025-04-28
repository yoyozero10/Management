import { useState, useEffect } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Summary from './components/Summary';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0091FF',
      light: '#E6F4FF',
      dark: '#0070E0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F5F9FF',
      light: '#FFFFFF',
      dark: '#E8F1FF',
    },
    error: {
      main: '#FF5757',
      light: '#FFE5E5',
    },
    success: {
      main: '#00C48C',
      light: '#E6F9F4',
    },
    background: {
      default: '#F5F9FF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1D1F',
      secondary: '#6F767E',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '10px 20px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container 
        maxWidth="md" 
        sx={{ 
          py: 4,
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Summary />
        <TransactionForm />
        <TransactionList />
      </Container>
    </ThemeProvider>
  );
}

export default App;
