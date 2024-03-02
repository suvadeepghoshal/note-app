import { createSlice } from '@reduxjs/toolkit';
import { CommonRS } from '../types/CommonRS';

const initialState: CommonRS = {
  notes: [
    {
      id: -1,
      title: '',
      content: '',
      created_at: '',
      updated_at: '',
      tags: [],
    },
  ],
  modal: { name: '', visible: false },
};

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    fetchNotes: (state, action) => {
      return { ...state, notes: action.payload };
    },
    createNote: (state, action) => {
      return { ...state, notes: [...state.notes!, action.payload] };
    },
    editNote: (state, action) => {
      return {
        ...state,
        notes: state.notes?.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    },
    deleteNote: (state, action) => {
      return {
        ...state,
        notes: state.notes?.filter((note) => note.id !== action.payload),
      };
    },
    toggleModal: (state, action) => {
      return {
        ...state,
        modal: action.payload,
      };
    },
  },
});

export const { fetchNotes, createNote, editNote, deleteNote, toggleModal } =
  noteSlice.actions;

export default noteSlice.reducer;
