import type { Note, CreateNoteRequest, UpdateNoteRequest, NotesResponse, SearchNotesParams, NoteCategory } from '@/types/notes';
import { stripHtmlTags } from './utils';

// const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:8080';

// Mock data for development - will be replaced with actual API calls
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Investment Strategy 2024',
    content: '<h2>Investment Strategy 2024</h2><p>This year I want to focus on building a diversified portfolio that balances growth and stability.</p><ul><li>Allocate 60% to index funds</li><li>20% to individual stocks</li><li>15% to bonds</li><li>5% to alternative investments</li></ul><p>Key principles:</p><ol><li>Dollar-cost averaging</li><li>Regular rebalancing</li><li>Long-term perspective</li></ol>',
    category: 'strategies',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    title: 'Monthly Budget Planning',
    content: '<h2>Monthly Budget Planning</h2><p>Essential expenses breakdown:</p><ul><li>Rent: $1,200</li><li>Utilities: $150</li><li>Groceries: $400</li><li>Transportation: $200</li><li>Insurance: $100</li></ul><p>Discretionary spending: $500</p><p>Savings goal: $450</p>',
    category: 'plans',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
  {
    id: '3',
    title: 'Tech Wishlist',
    content: '<h2>Tech Wishlist</h2><ul><li>New MacBook Pro 16" M3 Max</li><li>Standing desk with motorized height adjustment</li><li>Ultrawide monitor (34" or larger)</li><li>Mechanical keyboard (Keychron K8)</li><li>Wireless mouse (Logitech MX Master 3S)</li><li>Noise-canceling headphones (Sony WH-1000XM5)</li></ul>',
    category: 'wishlist',
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-01-12T11:15:00Z',
  },
  {
    id: '4',
    title: 'Financial Goals',
    content: '<h2>Financial Goals for 2024</h2><ul><li>Save $10,000 emergency fund</li><li>Pay off $5,000 credit card debt</li><li>Start retirement fund with $2,000 initial investment</li><li>Build investment portfolio worth $15,000</li><li>Track all expenses for 6 months</li><li>Increase income by 20% through side projects</li></ul>',
    category: 'bullet-points',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T13:30:00Z',
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const notesApi = {
  // Get all notes with optional search and filter
  async getNotes(params: SearchNotesParams = {}): Promise<NotesResponse> {
    await delay(300); // Simulate API delay
    
    let filteredNotes = [...mockNotes];
    
    // Apply search filter
    if (params.query) {
      const query = params.query.toLowerCase();
      filteredNotes = filteredNotes.filter(note => 
        note.title.toLowerCase().includes(query) ||
        stripHtmlTags(note.content).toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (params.category) {
      filteredNotes = filteredNotes.filter(note => note.category === params.category);
    }
    
    // Sort by updated date (newest first)
    filteredNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotes = filteredNotes.slice(startIndex, endIndex);
    
    return {
      notes: paginatedNotes,
      total: filteredNotes.length,
      page,
      limit,
    };
  },

  // Get a single note by ID
  async getNote(id: string): Promise<Note | null> {
    await delay(200);
    
    const note = mockNotes.find(note => note.id === id);
    return note || null;
  },

  // Create a new note
  async createNote(noteData: CreateNoteRequest): Promise<Note> {
    await delay(500);
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteData.title,
      content: noteData.content,
      category: noteData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockNotes.unshift(newNote); // Add to beginning of array
    return newNote;
  },

  // Update an existing note
  async updateNote(noteData: UpdateNoteRequest): Promise<Note> {
    await delay(500);
    
    const noteIndex = mockNotes.findIndex(note => note.id === noteData.id);
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }
    
    const updatedNote: Note = {
      id: mockNotes[noteIndex]!.id,
      title: noteData.title,
      content: noteData.content,
      category: noteData.category,
      createdAt: mockNotes[noteIndex]!.createdAt,
      updatedAt: new Date().toISOString(),
    };
    
    mockNotes[noteIndex] = updatedNote;
    return updatedNote;
  },

  // Delete a note
  async deleteNote(id: string): Promise<void> {
    await delay(300);
    
    const noteIndex = mockNotes.findIndex(note => note.id === id);
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }
    
    mockNotes.splice(noteIndex, 1);
  },

  // Search notes (alias for getNotes with query)
  async searchNotes(query: string, category?: string): Promise<Note[]> {
    const response = await this.getNotes({ query, category: category as NoteCategory });
    return response.notes;
  },
};

// Real API implementation (commented out for now)
/*
export const notesApi = {
  async getNotes(params: SearchNotesParams = {}): Promise<NotesResponse> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append('query', params.query);
    if (params.category) searchParams.append('category', params.category);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/api/notes?${searchParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    return response.json();
  },

  async getNote(id: string): Promise<Note | null> {
    const response = await fetch(`${API_BASE_URL}/api/notes/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to fetch note');
    }
    return response.json();
  },

  async createNote(noteData: CreateNoteRequest): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/api/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) {
      throw new Error('Failed to create note');
    }
    return response.json();
  },

  async updateNote(noteData: UpdateNoteRequest): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/api/notes/${noteData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) {
      throw new Error('Failed to update note');
    }
    return response.json();
  },

  async deleteNote(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
  },
};
*/
