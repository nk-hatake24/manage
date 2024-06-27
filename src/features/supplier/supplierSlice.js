// features/supplier/supplierSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk pour récupérer les données des fournisseurs
export const fetchSuppliers = createAsyncThunk(
  'supplier/fetchSuppliers',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3500/api/supplier', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }
);

const supplierSlice = createSlice({
  name: 'supplier',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default supplierSlice.reducer;
