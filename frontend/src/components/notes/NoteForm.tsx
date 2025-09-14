'use client';
import TiptapEditor from '@/components/editor/TiptapEditor';
import type { NoteFormProps, NoteCategory } from '@/types';
import { NOTE_CATEGORIES } from '@/lib/utils';

export default function NoteForm({
  title,
  content,
  category,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  isEditing = false
}: NoteFormProps) {
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
          onChange={(e) => onCategoryChange(e.target.value as NoteCategory)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {NOTE_CATEGORIES.filter(cat => cat.id !== 'all').map(cat => (
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
            onChange={onContentChange}
            placeholder="Start writing your note..."
          />
        </div>
      </div>
    </div>
  );
}

export { NOTE_CATEGORIES as categories };
