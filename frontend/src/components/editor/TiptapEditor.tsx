'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect } from 'react';
import { 
  BoldIcon, 
  ItalicIcon, 
  ListBulletIcon, 
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { 
  HashtagIcon
} from '@heroicons/react/24/solid';
import { 
  NumberedListIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
}

export default function TiptapEditor({ 
  content, 
  onChange, 
  placeholder = 'Start writing...',
  className = '',
  disabled = false
}: TiptapEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
    immediatelyRender: false,
  });

  // Show loading state during SSR
  if (!isMounted) {
    return (
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        <div className="border-b border-gray-300 dark:border-gray-600 p-2 flex flex-wrap gap-1">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="min-h-[300px] p-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title,
    disabled = false
  }: ToolbarButtonProps) => (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        'p-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'hover:bg-gray-100 dark:hover:bg-gray-700',
        isActive ? 'bg-gray-200 dark:bg-gray-600' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      )}
      aria-label={title}
      type="button"
    >
      {children}
    </button>
  );

  return (
    <div className={cn(
      'border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
      className
    )}>
      {/* Toolbar */}
      <div 
        className="border-b border-gray-300 dark:border-gray-600 p-2 flex flex-wrap gap-1"
        role="toolbar"
        aria-label="Text formatting toolbar"
      >
        {/* Headings */}
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2" role="group" aria-label="Headings">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
            disabled={disabled}
          >
            <HashtagIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
            disabled={disabled}
          >
            <HashtagIcon className="w-3 h-3" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
            disabled={disabled}
          >
            <HashtagIcon className="w-2 h-2" />
          </ToolbarButton>
        </div>

        {/* Text Formatting */}
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2" role="group" aria-label="Text formatting">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
            disabled={disabled}
          >
            <BoldIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
            disabled={disabled}
          >
            <ItalicIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Code"
            disabled={disabled}
          >
            <CodeBracketIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex" role="group" aria-label="Lists">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
            disabled={disabled}
          >
            <ListBulletIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
            disabled={disabled}
          >
            <NumberedListIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[300px]" role="textbox" aria-multiline="true" aria-label="Rich text editor">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 text-gray-900 dark:text-white"
        />
      </div>
    </div>
  );
}
