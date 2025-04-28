import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import { collection, query, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Summary = () => {
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });

  useEffect(() => {
    // Get start and end of current day
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // Create query for today's transactions
    const q = query(
      collection(db, 'transactions'),
      where('timestamp', '>=', Timestamp.fromDate(startOfDay)),
      where('timestamp', '<', Timestamp.fromDate(endOfDay))
    );

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

  // Get current date in Vietnamese format
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Main Balance Card */}
      <Card 
        sx={{ 
          mb: 3, 
          background: '#1e3947',
          color: 'white',
          borderRadius: 3,
          boxShadow: 'none',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.7, color: '#a7c0cd' }}>
            Tổng Số Dư Hôm Nay
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#a7c0cd' }}>
            {getCurrentDate()}
          </Typography>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 500, color: '#4dd0e1' }}>
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
              background: '#1e3947',
              borderRadius: 3,
              boxShadow: 'none',
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#a7c0cd', opacity: 0.7 }}>
              Thu
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 500, color: '#4dd0e1' }}>
              {formatCurrency(summary.income)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              background: '#1e3947',
              borderRadius: 3,
              boxShadow: 'none',
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#a7c0cd', opacity: 0.7 }}>
              Chi
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 500, color: '#ffd740' }}>
              {formatCurrency(summary.expenses)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Summary; 