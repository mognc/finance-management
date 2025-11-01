'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notesApi } from '@/lib/api/notes';
import { useApi } from '@/hooks/use-api';
import type { Note } from '@/types/notes';
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
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState<string[]>([]);
  const [is_favorite, setIsFavorite] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: noteData, loading: isLoading, execute: loadNote } = useApi<Note>();
  const { loading: isSaving, execute: saveNote } = useApi({
    successMessage: 'Note updated successfully',
    showErrorMessage: true,
  });
  const { execute: deleteNote } = useApi({
    successMessage: 'Note deleted successfully',
    showErrorMessage: true,
  });

  // Load note data
  useEffect(() => {
    if (noteId) {
      loadNote(() => notesApi.getNote(noteId));
    }
  }, [noteId, loadNote]);

  // Update form when note data loads
  useEffect(() => {
    if (noteData) {
      setNote(noteData);
      setTitle(noteData.title);
      setContent(noteData.content);
      setCategory(noteData.category);
      setTags(noteData.tags || []);
      setIsFavorite(noteData.is_favorite);
    }
  }, [noteData]);

  // Track changes
  useEffect(() => {
    if (note) {
      setHasChanges(
        title !== note.title ||
        content !== note.content ||
        category !== note.category ||
        JSON.stringify(tags) !== JSON.stringify(note.tags || []) ||
        is_favorite !== note.is_favorite
      );
    }
  }, [title, content, category, tags, is_favorite, note]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    await saveNote(() => notesApi.updateNote(noteId, {
      title: title.trim(),
      content,
      category,
      tags,
      is_favorite,
    }));
    
    setHasChanges(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    await deleteNote(() => notesApi.deleteNote(noteId));
    router.push('/notes');
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
          {...(note && { lastUpdated: formatDateLong(note.updated_at) })}
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
          tags={tags}
          is_favorite={is_favorite}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onCategoryChange={setCategory}
          onTagsChange={setTags}
          onFavoriteChange={setIsFavorite}
          isEditing={true}
        />
      </div>
    </MainLayout>
  );
}
