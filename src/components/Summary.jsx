import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Summary = () => {
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });

  useEffect(() => {
    const q = query(collection(db, 'transactions'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const totals = snapshot.docs.reduce(
        (acc, doc) => {
          const data = doc.data();
          if (data.type === 'income') {
            acc.income += data.amount;
          } else {
            acc.expenses += data.amount;
          }
          return acc;
        },
        { income: 0, expenses: 0 }
      );

      setSummary({
        income: totals.income,
        expenses: totals.expenses,
        balance: totals.income - totals.expenses,
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              textAlign: 'center',
              bgcolor: 'success.light',
              color: 'success.contrastText',
            }}
          >
            <Typography variant="h6">Income</Typography>
            <Typography variant="h4">${summary.income}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              textAlign: 'center',
              bgcolor: 'error.light',
              color: 'error.contrastText',
            }}
          >
            <Typography variant="h6">Expenses</Typography>
            <Typography variant="h4">${summary.expenses}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              textAlign: 'center',
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            }}
          >
            <Typography variant="h6">Balance</Typography>
            <Typography variant="h4">${summary.balance}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Summary; 