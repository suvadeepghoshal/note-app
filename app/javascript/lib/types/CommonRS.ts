import { NoteRS } from './NoteRS';

export type CommonRS = {
  type?: string;
  message?: string;
  notes?: NoteRS[];
  modal?: { name: string; visible: boolean };
};
