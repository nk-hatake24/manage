// features/sell/sellSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTransactions = createAsyncThunk('sell/fetchTransactions', async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:3500/api/sell', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
});

const sellSlice = createSlice({
  name: 'sell',
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

export default sellSlice.reducer;
