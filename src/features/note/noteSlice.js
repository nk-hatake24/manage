// features/note/noteSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNotes = createAsyncThunk('note/fetchNotes', async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:3500/api/note', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

const noteSlice = createSlice({
  name: 'note',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default noteSlice.reducer;
