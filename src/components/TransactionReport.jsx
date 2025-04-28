import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Divider
} from '@mui/material';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const TransactionReport = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [report, setReport] = useState({
    transactions: [],
    summary: {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0
    }
  });
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReport = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      alert('Vui lòng chọn khoảng thời gian');
      return;
    }

    setLoading(true);
    try {
      const start = new Date(dateRange.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'transactions'),
        where('timestamp', '>=', Timestamp.fromDate(start)),
        where('timestamp', '<=', Timestamp.fromDate(end))
      );

      const querySnapshot = await getDocs(q);
      const transactions = [];
      let totalIncome = 0;
      let totalExpense = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate()
        });
        if (data.type === 'income') {
          totalIncome += data.amount;
        } else {
          totalExpense += data.amount;
        }
      });

      // Sắp xếp theo thời gian mới nhất
      transactions.sort((a, b) => b.timestamp - a.timestamp);

      setReport({
        transactions,
        summary: {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense
        }
      });
    } catch (error) {
      console.error('Lỗi khi tạo báo cáo:', error);
      alert('Có lỗi xảy ra khi tạo báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#4dd0e1', mb: 3 }}>
        Sao Kê Giao Dịch
      </Typography>

      {/* Date Range Selector */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ mb: 3 }}
      >
        <TextField
          label="Từ Ngày"
          type="date"
          name="startDate"
          value={dateRange.startDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={{ bgcolor: '#1e3947', borderRadius: 1 }}
        />
        <TextField
          label="Đến Ngày"
          type="date"
          name="endDate"
          value={dateRange.endDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={{ bgcolor: '#1e3947', borderRadius: 1 }}
        />
        <Button
          variant="contained"
          onClick={generateReport}
          disabled={loading}
          sx={{
            bgcolor: '#4dd0e1',
            color: '#1e3947',
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#00acc1',
            },
            minWidth: '150px',
            fontSize: '1.2rem',
            py: 1.8
          }}
        >
          {loading ? 'Đang Tạo...' : 'Sao Kê'}
        </Button>
      </Stack>

      {/* Summary Cards */}
      {report.transactions.length > 0 && (
        <>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ mb: 3 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                flex: 1,
                background: '#1e3947',
                borderRadius: 3,
                boxShadow: 'none',
              }}
            >
              <Typography variant="subtitle2" sx={{ color: '#a7c0cd', opacity: 0.7 }}>
                Tổng Thu
              </Typography>
              <Typography variant="h6" sx={{ color: '#4dd0e1', fontWeight: 500 }}>
                {formatCurrency(report.summary.totalIncome)}
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                flex: 1,
                background: '#1e3947',
                borderRadius: 3,
                boxShadow: 'none',
              }}
            >
              <Typography variant="subtitle2" sx={{ color: '#a7c0cd', opacity: 0.7 }}>
                Tổng Chi
              </Typography>
              <Typography variant="h6" sx={{ color: '#ffd740', fontWeight: 500 }}>
                {formatCurrency(report.summary.totalExpense)}
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                flex: 1,
                background: '#1e3947',
                borderRadius: 3,
                boxShadow: 'none',
              }}
            >
              <Typography variant="subtitle2" sx={{ color: '#a7c0cd', opacity: 0.7 }}>
                Số Dư
              </Typography>
              <Typography variant="h6" sx={{ color: '#4dd0e1', fontWeight: 500 }}>
                {formatCurrency(report.summary.balance)}
              </Typography>
            </Paper>
          </Stack>

          {/* Transactions Table */}
          <TableContainer 
            component={Paper}
            sx={{ 
              background: '#1e3947',
              borderRadius: 3,
              boxShadow: 'none'
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#a7c0cd' }}>Thời Gian</TableCell>
                  <TableCell sx={{ color: '#a7c0cd' }}>Loại</TableCell>
                  <TableCell sx={{ color: '#a7c0cd' }}>Mô Tả</TableCell>
                  <TableCell align="right" sx={{ color: '#a7c0cd' }}>Số Tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell sx={{ color: '#fff' }}>
                      {formatDate(transaction.timestamp)}
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      {transaction.type === 'income' ? 'Thu' : 'Chi'}
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      {transaction.description}
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        color: transaction.type === 'income' ? '#4dd0e1' : '#ffd740',
                        fontWeight: 500
                      }}
                    >
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default TransactionReport; 