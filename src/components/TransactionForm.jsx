import { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
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
      });
    } catch (error) {
      console.error('Lỗi khi thêm giao dịch:', error);
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
        <InputLabel>Loại</InputLabel>
        <Select
          name="type"
          value={formData.type}
          label="Loại"
          onChange={handleChange}
        >
          <MenuItem value="income">Thu</MenuItem>
          <MenuItem value="expense">Chi</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Số Tiền"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Mô Tả"
        name="description"
        value={formData.description}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          background: '#4dd0e1',
          color: '#1e3947',
          fontWeight: 600,
          '&:hover': {
            background: '#00acc1',
          },
          py: 1.5,
          fontSize: '1rem',
        }}
      >
        Thêm Giao Dịch
      </Button>
    </Box>
  );
};

export default TransactionForm; 