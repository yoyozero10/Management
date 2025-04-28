import { useState, useEffect } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Summary from './components/Summary';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Summary />
        <TransactionForm />
        <TransactionList />
      </Container>
    </ThemeProvider>
  );
}

export default App;
