import { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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
      console.error('Error deleting transaction:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Transaction History
      </Typography>
      <List>
        {transactions.map((transaction) => (
          <ListItem
            key={transaction.id}
            sx={{
              mb: 1,
              bgcolor: transaction.type === 'income' ? 'success.50' : 'error.50',
              borderRadius: 1,
            }}
          >
            <ListItemText
              primary={transaction.description}
              secondary={
                <>
                  {formatDate(transaction.timestamp)} - {transaction.category}
                  <br />
                  <Typography
                    component="span"
                    variant="body2"
                    color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount)}
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(transaction.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TransactionList; 