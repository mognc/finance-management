export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  createdAt: string;
  updatedAt: string;
}

export type NoteCategory = 
  | 'bullet-points'
  | 'plans'
  | 'strategies'
  | 'wishlist'
  | 'other';

export interface CreateNoteRequest {
  title: string;
  content: string;
  category: NoteCategory;
}

export interface UpdateNoteRequest {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
}

export interface NotesResponse {
  notes: Note[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchNotesParams {
  query?: string;
  category?: NoteCategory;
  page?: number;
  limit?: number;
}
