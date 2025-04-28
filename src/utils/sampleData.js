import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const sampleTransactions = [
  {
    type: 'income',
    amount: 15000000,
    description: 'Lương tháng 12',
    timestamp: new Date('2023-12-01')
  },
  {
    type: 'expense',
    amount: 2000000,
    description: 'Tiền điện nước',
    timestamp: new Date('2023-12-03')
  },
  {
    type: 'expense',
    amount: 5000000,
    description: 'Tiền thuê nhà',
    timestamp: new Date('2023-12-05')
  },
  {
    type: 'income',
    amount: 3000000,
    description: 'Thưởng dự án',
    timestamp: new Date('2023-12-10')
  },
  {
    type: 'expense',
    amount: 1500000,
    description: 'Mua sắm',
    timestamp: new Date('2023-12-15')
  },
  {
    type: 'income',
    amount: 2000000,
    description: 'Freelance',
    timestamp: new Date('2023-12-20')
  },
  {
    type: 'expense',
    amount: 3000000,
    description: 'Sửa xe',
    timestamp: new Date('2023-12-25')
  },
  {
    type: 'income',
    amount: 5000000,
    description: 'Thưởng tết',
    timestamp: new Date('2024-01-01')
  },
  {
    type: 'expense',
    amount: 4000000,
    description: 'Mua quà tết',
    timestamp: new Date('2024-01-05')
  },
  {
    type: 'expense',
    amount: 2500000,
    description: 'Đi chơi tết',
    timestamp: new Date('2024-01-10')
  }
];

export const addSampleData = async () => {
  try {
    for (const transaction of sampleTransactions) {
      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        timestamp: serverTimestamp()
      });
    }
    console.log('Đã thêm dữ liệu mẫu thành công!');
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu mẫu:', error);
  }
};

export const deleteAllData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'transactions'));
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log('Đã xóa tất cả dữ liệu thành công!');
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu:', error);
  }
}; 