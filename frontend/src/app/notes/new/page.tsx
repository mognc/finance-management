'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notesApi } from '@/lib/api/notes';
import type { NoteCategory } from '@/types/notes';
import MainLayout from '@/components/layout/MainLayout';
import NoteHeader from '@/components/notes/NoteHeader';
import NoteForm from '@/components/notes/NoteForm';

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
        <NoteHeader
          isEditing={false}
          isSaving={isSaving}
          canSave={!!title.trim()}
          onSave={handleSave}
        />

        <NoteForm
          title={title}
          content={content}
          category={category}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onCategoryChange={setCategory}
          isEditing={false}
        />
      </div>
    </MainLayout>
  );
}
