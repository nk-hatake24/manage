// features/resource/resourceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk pour récupérer les données des ressources
export const fetchResources = createAsyncThunk(
  'resource/fetchResources',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3500/api/resource', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

const resourceSlice = createSlice({
  name: 'resource',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default resourceSlice.reducer;
