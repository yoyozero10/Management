import { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, IconButton, Grid, Button } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Summary from './components/Summary';
import ExpenseChart from './components/ExpenseChart';
import TransactionReport from './components/TransactionReport';
import { deleteAllData } from './utils/sampleData';

function App() {
  const [mode, setMode] = useState('dark');

  const theme = createTheme({
    palette: {
      mode: mode,
      ...(mode === 'dark' ? {
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b3b3b3',
        },
      } : {
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
      }),
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

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleDeleteAllData = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu không?')) {
      await deleteAllData();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Box sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleDeleteAllData}
            >
              Xóa Tất Cả Dữ Liệu
            </Button>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
                <Summary />
                <TransactionForm />
                <TransactionReport />
                <TransactionList />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <ExpenseChart />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
