// features/transaction/transactionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk pour récupérer les données des transactions
export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3500/api/transaction', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default transactionSlice.reducer;
