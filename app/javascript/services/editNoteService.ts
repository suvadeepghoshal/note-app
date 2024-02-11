import { NoteRQ } from '../lib/types/NoteRQ';
import { AppDispatch } from '../lib/redux/store';
import axios from 'axios';
import { CommonRS } from '../lib/types/CommonRS';
import { editNote } from '../lib/redux/noteSlice';
import { Tag } from '../lib/types/Tag';

export const editNoteService = (note: NoteRQ) => {
  try {
    return async (dispatch: AppDispatch) => {
      const { title, content, tags } = note;

      try {
        const data = {
          title: title,
          content: content,
          tag_names: tags.map((tag: Tag) => tag.name),
        };
        const config = {
          headers: {
            'X-CSRF-Token': document
              .querySelector(`meta[name="csrf-token"]`)
              ?.getAttribute('content'),
          },
        };
        const response = await axios.put(
          `api/v1/notes/${note.id}`,
          data,
          config
        );
        const editedNoteData: CommonRS =
          response.status === 200 && response.data;
        if (editedNoteData.type === 'error') {
          return {
            type: editedNoteData?.type,
            message: editedNoteData?.message,
          };
        } else {
          dispatch(editNote(editedNoteData));
          return {
            type: editedNoteData?.type,
            message: editedNoteData?.message,
            note: editedNoteData?.note,
          };
        }
      } catch (error: any) {
        return {
          type: error?.type,
          message: error?.message,
        };
      }
    };
  } catch (_error) {
    return {
      type: 'error',
      message: 'Unable to edit the note',
    };
  }
};
