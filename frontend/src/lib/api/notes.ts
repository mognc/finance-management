import type { 
  Note, 
  CreateNoteRequest, 
  UpdateNoteRequest, 
  SearchNotesParams,
  ApiResponse 
} from '@/types/notes';
import { apiClient, apiRequest } from './client';

// Utility function to build query parameters
const buildQueryParams = (params: SearchNotesParams): string => {
  const searchParams = new URLSearchParams();
  
  if (params.query) searchParams.append('q', params.query);
  if (params.category) searchParams.append('category', params.category);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  
  return searchParams.toString();
};

// Notes API implementation
export const notesApi = {
  // Get all notes with optional search and filter
  async getNotes(params: SearchNotesParams = {}): Promise<ApiResponse<Note[]>> {
    const queryString = buildQueryParams(params);
    const url = queryString ? `/api/notes?${queryString}` : '/api/notes';
    
    return apiRequest(() => apiClient.get<Note[]>(url));
  },

  // Get a single note by ID
  async getNote(id: string): Promise<ApiResponse<Note>> {
    return apiRequest(() => apiClient.get<Note>(`/api/notes/${id}`));
  },

  // Create a new note
  async createNote(noteData: CreateNoteRequest): Promise<ApiResponse<Note>> {
    return apiRequest(() => apiClient.post<Note>('/api/notes', noteData));
  },

  // Update an existing note
  async updateNote(id: string, noteData: UpdateNoteRequest): Promise<ApiResponse<Note>> {
    return apiRequest(() => apiClient.put<Note>(`/api/notes/${id}`, noteData));
  },

  // Delete a note
  async deleteNote(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest(() => apiClient.delete(`/api/notes/${id}`));
  },

  // Toggle favorite status
  async toggleFavorite(id: string, isFavorite: boolean): Promise<ApiResponse<Note>> {
    return this.updateNote(id, { is_favorite: isFavorite });
  },

  // Archive/unarchive note
  async toggleArchive(id: string, isArchived: boolean): Promise<ApiResponse<Note>> {
    return this.updateNote(id, { is_archived: isArchived });
  }
};