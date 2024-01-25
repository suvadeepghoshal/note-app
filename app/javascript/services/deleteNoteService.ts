import { AppDispatch } from '../lib/redux/store';
import axios from 'axios';
import { deleteNote } from '../lib/redux/noteSlice';
import { CommonRS } from '../lib/types/CommonRS';

export const deleteNoteService = (id: number) => {
  try {
    return async (dispatch: AppDispatch) => {
      try {
        const response = await axios.delete(`api/v1/notes/${id}`, {
          headers: {
            'X-CSRF-Token': document
              .querySelector(`meta[name="csrf-token"]`)
              ?.getAttribute('content'),
          },
        });
        const deletedNoteData: CommonRS =
          response.status === 200 && response.data;
        if (deletedNoteData.type === 'error')
          return {
            type: deletedNoteData?.type,
            message: deletedNoteData?.message,
          };
        else {
          dispatch(deleteNote(deletedNoteData));
          return {
            type: deletedNoteData?.type,
            message: deletedNoteData?.message,
            note: deletedNoteData?.note,
          };
        }
      } catch (error: any) {
        return {
          type: error?.type,
          message: error?.message,
        };
      }
    };
  } catch (_error: any) {
    return {
      type: 'error',
      message: 'Unable to delete the note',
    };
  }
};
