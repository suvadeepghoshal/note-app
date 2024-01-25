import { Tag } from './Tag';

export interface NoteRS {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}
