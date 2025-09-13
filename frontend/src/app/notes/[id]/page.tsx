'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BookmarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import TiptapEditor from '@/components/TiptapEditor';
import { notesApi } from '@/lib/notes-api';
import type { Note, NoteCategory } from '@/types/notes';
import MainLayout from '@/components/MainLayout';
import BackButton from '@/components/BackButton';

const categories = [
  { id: 'bullet-points', name: 'Bullet Points' },
  { id: 'plans', name: 'Plans' },
  { id: 'strategies', name: 'Strategies' },
  { id: 'wishlist', name: 'Wishlist' },
  { id: 'other', name: 'Other' },
];

export default function NoteEditorPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params['id'] as string;

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('other');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Load note data
  useEffect(() => {
    const loadNote = async () => {
      try {
        const loadedNote = await notesApi.getNote(noteId);
        if (!loadedNote) {
          router.push('/notes');
          return;
        }
        
        setNote(loadedNote);
        setTitle(loadedNote.title);
        setContent(loadedNote.content);
        setCategory(loadedNote.category);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading note:', error);
        router.push('/notes');
      }
    };

    if (noteId) {
      loadNote();
    }
  }, [noteId, router]);

  // Track changes
  useEffect(() => {
    if (!isLoading && note) {
      setHasChanges(
        title !== note.title ||
        content !== note.content ||
        category !== note.category
      );
    }
  }, [title, content, category, isLoading, note]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    setIsSaving(true);
    
    try {
      const updatedNote = await notesApi.updateNote({
        id: noteId,
        title: title.trim(),
        content,
        category,
      });
      
      setNote(updatedNote);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    try {
      await notesApi.deleteNote(noteId);
      router.push('/notes');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BackButton fallbackHref="/notes" className="mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Note</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {note && `Last updated ${formatDate(note.updatedAt)}`}
              </p>
            </div>
          </div>
        
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-orange-600 dark:text-orange-400">
              Unsaved changes
            </span>
          )}
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            title="Delete note"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !hasChanges}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <BookmarkIcon className="w-5 h-5 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Note Form */}
      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-medium"
          />
        </div>

        {/* Category Selection */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as NoteCategory)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your note..."
            />
          </div>
        </div>
      </div>
      </div>
    </MainLayout>
  );
}
