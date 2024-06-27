// features/employee/employeeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk pour récupérer les données des employés
export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async () => {
    const response = await axios.get('http://localhost:3500/api/employee');
    return response.data.data;
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default employeeSlice.reducer;
