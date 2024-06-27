// features/budget/budgetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk pour récupérer les données des budgets
export const fetchBudgets = createAsyncThunk(
  'budget/fetchBudgets',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3500/api/budget', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default budgetSlice.reducer;
