import { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Box,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'transactions'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(transactionData);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Lỗi khi xóa giao dịch:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
      <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
        Lịch Sử Giao Dịch
      </Typography>
      <List>
        {transactions.map((transaction) => (
          <Paper
            key={transaction.id}
            elevation={0}
            sx={{
              mb: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'secondary.dark',
              borderRadius: 2,
            }}
          >
            <ListItem
              sx={{
                py: 2,
                px: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mr: 2,
                  p: 1,
                  borderRadius: 2,
                  bgcolor: transaction.type === 'income' ? 'success.light' : 'error.light',
                }}
              >
                {transaction.type === 'income' ? (
                  <ArrowUpwardIcon color="success" />
                ) : (
                  <ArrowDownwardIcon color="error" />
                )}
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                  {transaction.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(transaction.timestamp)}
                  </Typography>
                  {transaction.category && (
                    <Chip
                      label={transaction.category}
                      size="small"
                      sx={{ 
                        bgcolor: 'secondary.main',
                        color: 'text.secondary',
                      }}
                    />
                  )}
                </Box>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: transaction.type === 'income' ? 'success.main' : 'error.main',
                  }}
                >
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </Typography>
              </Box>

              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="xóa"
                  onClick={() => handleDelete(transaction.id)}
                  sx={{ color: 'text.secondary' }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Paper>
  );
};

export default TransactionList; 