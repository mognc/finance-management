export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  is_favorite: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export type NoteCategory = 
  | 'general'
  | 'bullet-points'
  | 'plans'
  | 'strategies'
  | 'wishlist'
  | 'other';

export interface CreateNoteRequest {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  is_favorite?: boolean;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  is_favorite?: boolean;
  is_archived?: boolean;
}

export interface NotesResponse {
  notes: Note[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchNotesParams {
  query?: string;
  category?: string;
  page?: number;
  limit?: number;
}

// API Error Response
export interface ApiError {
  error: string;
  details?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}
