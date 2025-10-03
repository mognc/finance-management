'use client';
import { useState } from 'react';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { NOTE_CATEGORIES } from '@/lib/utils';

interface NoteFormProps {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  is_favorite?: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: string) => void;
  onTagsChange?: (tags: string[]) => void;
  onFavoriteChange?: (is_favorite: boolean) => void;
  isEditing?: boolean;
}

export default function NoteForm({
  title,
  content,
  category,
  tags = [],
  is_favorite = false,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onTagsChange,
  onFavoriteChange,
  isEditing = false
}: NoteFormProps) {
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim() && onTagsChange) {
      const newTags = [...tags, tagInput.trim()];
      onTagsChange(newTags);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    if (onTagsChange) {
      const newTags = tags.filter((_, i) => i !== index);
      onTagsChange(newTags);
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
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
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter note title..."
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-medium"
          autoFocus={!isEditing}
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
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {NOTE_CATEGORIES.filter(cat => cat.id !== 'all').map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Input */}
      {onTagsChange && (
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Favorite Toggle */}
      {onFavoriteChange && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="favorite"
            checked={is_favorite}
            onChange={(e) => onFavoriteChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="favorite" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Mark as favorite
          </label>
        </div>
      )}

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content
        </label>
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <TiptapEditor
            content={content}
            onChange={onContentChange}
            placeholder="Start writing your note..."
          />
        </div>
      </div>
    </div>
  );
}

export { NOTE_CATEGORIES as categories };
