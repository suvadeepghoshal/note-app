import { AppDispatch } from '../lib/redux/store';
import axios from 'axios';
import { NoteRS } from '../lib/types/NoteRS';
import { fetchNotes } from '../lib/redux/noteSlice';

export const fetchNotesService = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get('/api/v1/notes');
      const data: NoteRS = response.status === 200 ? response.data : [];
      dispatch(fetchNotes(data));
    } catch (error) {
      return {
        message: 'Can not retrieve notes currently',
        type: 'error',
      };
    }
  };
};
