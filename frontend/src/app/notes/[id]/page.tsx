'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notesApi } from '@/lib/api/notes';
import type { Note, NoteCategory } from '@/types/notes';
import MainLayout from '@/components/layout/MainLayout';
import NoteHeader from '@/components/notes/NoteHeader';
import NoteForm from '@/components/notes/NoteForm';
import { formatDateLong } from '@/lib/utils';

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
        <NoteHeader
          isEditing={true}
          {...(note && { lastUpdated: formatDateLong(note.updatedAt) })}
          hasChanges={hasChanges}
          isSaving={isSaving}
          canSave={!!title.trim() && hasChanges}
          onSave={handleSave}
          onDelete={handleDelete}
        />

        <NoteForm
          title={title}
          content={content}
          category={category}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onCategoryChange={setCategory}
          isEditing={true}
        />
      </div>
    </MainLayout>
  );
}
