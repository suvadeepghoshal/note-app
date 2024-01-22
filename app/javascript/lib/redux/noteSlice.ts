import { createSlice } from '@reduxjs/toolkit';
import { NoteRS } from '../types/NoteRS';

const initialState: { notes: NoteRS[] } = {
  notes: [
    {
      id: -1,
      title: '',
      content: '',
      created_at: '',
      updated_at: '',
      tags: [],
      message: '',
      type: '',
    },
  ],
};

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    fetchNotes: (state, action) => {
      return { ...state, notes: action.payload };
    },
    createNote: (state, action) => {
      return { ...state, notes: [...state.notes, action.payload] };
    },
    editNote: (_state, _action) => {},
    deleteNote: (_state, _action) => {},
  },
});

export const { fetchNotes, createNote, editNote, deleteNote } =
  noteSlice.actions;

export default noteSlice.reducer;
