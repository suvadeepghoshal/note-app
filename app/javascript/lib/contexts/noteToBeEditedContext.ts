import React, { createContext } from 'react';
import { NoteRQ } from '../types/NoteRQ';

export const NoteToBeEditedContext: React.Context<NoteRQ> =
  createContext<NoteRQ>({
    id: 0,
    title: '',
    content: '',
    tags: [],
  });
