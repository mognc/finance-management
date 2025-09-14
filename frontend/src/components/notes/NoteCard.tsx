'use client';

import Link from 'next/link';
import type { NoteCardProps } from '@/types';
import { getContentPreview, formatDateShort, getCategoryColor, getCategoryName } from '@/lib/utils';

export default function NoteCard({ note }: NoteCardProps) {

  return (
    <Link
      href={`/notes/${note.id}`}
      className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {note.title}
        </h3>
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(note.category)}`}>
          {getCategoryName(note.category)}
        </span>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
        {getContentPreview(note.content)}
      </p>
      
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>Updated {formatDateShort(note.updatedAt)}</span>
        <span>Created {formatDateShort(note.createdAt)}</span>
      </div>
    </Link>
  );
}
