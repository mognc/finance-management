'use client';

import Link from 'next/link';
import { HeartIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import type { Note } from '@/types/notes';
import { getContentPreview, formatDateShort, getCategoryColor, getCategoryName } from '@/lib/utils';
import { notesApi } from '@/lib/api/notes';
import { useApi } from '@/hooks/use-api';
import { useState } from 'react';

interface NoteCardProps {
  note: Note;
  onUpdate?: (note: Note) => void;
}

export default function NoteCard({ note, onUpdate }: NoteCardProps) {
  const [isFavorite, setIsFavorite] = useState(note.is_favorite);
  const [isArchived, setIsArchived] = useState(note.is_archived);
  
  const { execute: toggleFavorite } = useApi({ 
    showSuccessMessage: false,
    showErrorMessage: true 
  });
  
  const { execute: toggleArchive } = useApi({ 
    showSuccessMessage: false,
    showErrorMessage: true 
  });

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    try {
      await toggleFavorite(() => notesApi.toggleFavorite(note.id, newFavoriteState));
      if (onUpdate) {
        onUpdate({ ...note, is_favorite: newFavoriteState });
      }
    } catch (error) {
      // Revert on error
      setIsFavorite(!newFavoriteState);
    }
  };

  const handleToggleArchive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newArchiveState = !isArchived;
    setIsArchived(newArchiveState);
    
    try {
      await toggleArchive(() => notesApi.toggleArchive(note.id, newArchiveState));
      if (onUpdate) {
        onUpdate({ ...note, is_archived: newArchiveState });
      }
    } catch (error) {
      // Revert on error
      setIsArchived(!newArchiveState);
    }
  };

  return (
    <Link
      href={`/notes/${note.id}`}
      className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {note.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(note.category)}`}>
            {getCategoryName(note.category)}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
        {getContentPreview(note.content)}
      </p>
      
      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{note.tags.length - 3} more
            </span>
          )}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleFavorite}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-4 h-4 text-red-500" />
            ) : (
              <HeartIcon className="w-4 h-4 text-gray-400 hover:text-red-500" />
            )}
          </button>
          
          <button
            onClick={handleToggleArchive}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isArchived ? 'Unarchive note' : 'Archive note'}
          >
            <ArchiveBoxIcon className={`w-4 h-4 ${isArchived ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`} />
          </button>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span>Updated {formatDateShort(note.updated_at)}</span>
        </div>
      </div>
    </Link>
  );
}
