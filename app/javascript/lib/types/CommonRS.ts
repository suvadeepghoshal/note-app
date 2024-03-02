import { NoteRS } from './NoteRS';

export type CommonRS = {
  type?: string;
  message?: string;
  // note?: NoteRS;
  notes?: NoteRS[];
  modal?: { name: string; visible: boolean };
};
