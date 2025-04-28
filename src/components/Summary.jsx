import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent } from '@mui/material';
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Main Balance Card */}
      <Card 
        sx={{ 
          mb: 3, 
          background: 'linear-gradient(135deg, #0091FF 0%, #0070E0 100%)',
          color: 'white',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>
            Tổng Số Dư
          </Typography>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {formatCurrency(summary.balance)}
          </Typography>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: 'success.light',
              borderRadius: 3,
            }}
          >
            <Typography variant="subtitle2" color="success.dark" sx={{ mb: 1 }}>
              Thu Nhập
            </Typography>
            <Typography variant="h6" color="success.main">
              {formatCurrency(summary.income)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: 'error.light',
              borderRadius: 3,
            }}
          >
            <Typography variant="subtitle2" color="error.main" sx={{ mb: 1 }}>
              Chi Tiêu
            </Typography>
            <Typography variant="h6" color="error.main">
              {formatCurrency(summary.expenses)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Summary; 