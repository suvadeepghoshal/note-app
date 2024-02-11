import { Tag } from './Tag';

export interface NoteRQ {
  id?: number;
  title: string;
  content: string;
  tags: Tag[];
}
