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
          <MenuItem value="income">Thu Nhập</MenuItem>
          <MenuItem value="expense">Chi Tiêu</MenuItem>
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

      <TextField
        fullWidth
        label="Danh Mục"
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
        Thêm Giao Dịch
      </Button>
    </Box>
  );
};

export default TransactionForm; 