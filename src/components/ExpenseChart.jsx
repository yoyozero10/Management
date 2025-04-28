import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const ExpenseChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      // Nhóm giao dịch theo ngày và tính tổng
      const dailyData = transactions.reduce((acc, transaction) => {
        if (!transaction.timestamp) return acc;

        const date = transaction.timestamp.toDate().toLocaleDateString('vi-VN');
        const amount = transaction.type === 'expense' ? -transaction.amount : transaction.amount;

        if (!acc[date]) {
          acc[date] = { date, amount: 0 };
        }
        acc[date].amount += amount;
        return acc;
      }, {});

      // Chuyển đổi dữ liệu cho biểu đồ
      const formattedData = Object.values(dailyData).map(item => ({
        date: item.date,
        amount: item.amount
      }));

      setChartData(formattedData);
    });

    return () => unsubscribe();
  }, []);

  const formatYAxis = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <Paper sx={{ 
      p: 2, 
      height: 'calc(100vh - 100px)',
      mb: 2,
      position: 'sticky',
      top: '20px'
    }}>
      <Box sx={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(value)}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#00C48C" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ExpenseChart; 