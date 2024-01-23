import { AppDispatch } from '../lib/redux/store';
import axios from 'axios';
import { NoteRS } from '../lib/types/NoteRS';
import { NoteRQ } from '../lib/types/NoteRQ';
import { Tag } from '../lib/types/Tag';
import { createNote } from '../lib/redux/noteSlice';

export const createNoteService = (data: NoteRQ) => {
  return async (dispatch: AppDispatch) => {
    try {
      const reqObj = {
        note: {
          title: data.title,
          content: data.content,
        },
        tag_names: data.tags.map((tag: Tag) => tag.name),
      };
      const result = await axios.post('api/v1/notes', reqObj, {
        headers: {
          'X-CSRF-Token': document
            .querySelector(`meta[name="csrf-token"]`)
            ?.getAttribute('content'),
        },
      });
      const response: NoteRS = result.status === 200 && result.data;
      if (response?.type === 'error')
        return { type: response?.type, message: response?.message };
      else {
        dispatch(createNote(response));
        return { type: 'info', message: 'Note is created Successfully.' };
      }
    } catch (error: any) {
      return {
        type: 'error',
        message: 'Unable to create note. Please try again.',
      };
    }
  };
};
