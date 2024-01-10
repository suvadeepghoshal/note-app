import {Tag} from "./Tag";

export interface NoteRQ {
    title: string;
    content: string;
    tags: Tag[]
}