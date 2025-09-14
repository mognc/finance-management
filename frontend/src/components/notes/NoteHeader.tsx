'use client';

import { BookmarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import BackButton from '@/components/navigation/BackButton';
import type { NoteHeaderProps } from '@/types';

export default function NoteHeader({
  isEditing,
  lastUpdated,
  hasChanges = false,
  isSaving = false,
  canSave = true,
  onSave,
  onDelete
}: NoteHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <BackButton fallbackHref="/notes" className="mr-4" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Note' : 'New Note'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditing && lastUpdated 
              ? `Last updated ${lastUpdated}`
              : 'Create a new note to organize your thoughts'
            }
          </p>
        </div>
      </div>
    
      <div className="flex items-center gap-3">
        {hasChanges && (
          <span className="text-sm text-orange-600 dark:text-orange-400">
            Unsaved changes
          </span>
        )}
        
        {isEditing && onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            title="Delete note"
            type="button"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
        
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving || !canSave}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            type="button"
          >
            <BookmarkIcon className="w-5 h-5 mr-2" />
            {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Save Note')}
          </button>
        )}
      </div>
    </div>
  );
}
