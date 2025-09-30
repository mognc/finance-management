'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notesApi } from '@/lib/api/notes';
import { useApi } from '@/hooks/use-api';
import MainLayout from '@/components/layout/MainLayout';
import NoteHeader from '@/components/notes/NoteHeader';
import NoteForm from '@/components/notes/NoteForm';

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState<string[]>([]);
  const [is_favorite, setIsFavorite] = useState(false);
  
  const { loading: isSaving, execute: createNote } = useApi({
    successMessage: 'Note created successfully',
    showErrorMessage: true,
  });

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    await createNote(() => notesApi.createNote({
      title: title.trim(),
      content,
      category,
      tags,
      is_favorite,
    }));
    
    // Redirect to notes list on success
    router.push('/notes');
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
          tags={tags}
          is_favorite={is_favorite}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onCategoryChange={setCategory}
          onTagsChange={setTags}
          onFavoriteChange={setIsFavorite}
          isEditing={false}
        />
      </div>
    </MainLayout>
  );
}
