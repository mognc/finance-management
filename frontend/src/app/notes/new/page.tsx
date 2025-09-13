'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {  BookmarkIcon } from '@heroicons/react/24/outline';
import TiptapEditor from '@/components/TiptapEditor';
import { notesApi } from '@/lib/notes-api';
import type { NoteCategory } from '@/types/notes';
import MainLayout from '@/components/MainLayout';
import BackButton from '@/components/BackButton';

const categories = [
  { id: 'bullet-points', name: 'Bullet Points' },
  { id: 'plans', name: 'Plans' },
  { id: 'strategies', name: 'Strategies' },
  { id: 'wishlist', name: 'Wishlist' },
  { id: 'other', name: 'Other' },
];

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('other');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    setIsSaving(true);
    
    try {
      const newNote = await notesApi.createNote({
        title: title.trim(),
        content,
        category,
      });
      
      // Redirect to the newly created note
      router.push(`/notes/${newNote.id}`);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BackButton fallbackHref="/notes" className="mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Note</h1>
              <p className="text-gray-600 dark:text-gray-400">Create a new note to organize your thoughts</p>
            </div>
          </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving || !title.trim()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
            <BookmarkIcon className="w-5 h-5 mr-2" />
          {isSaving ? 'Saving...' : 'Save Note'}
        </button>
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
