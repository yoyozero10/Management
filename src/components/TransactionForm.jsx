import { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    try {
      await addDoc(collection(db, 'transactions'), {
        ...formData,
        amount: Number(formData.amount),
        timestamp: serverTimestamp(),
      });

      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Type</InputLabel>
        <Select
          name="type"
          value={formData.type}
          label="Type"
          onChange={handleChange}
        >
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Amount"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
      >
        Add Transaction
      </Button>
    </Box>
  );
};

export default TransactionForm; 