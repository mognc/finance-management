// Layout Component Types
export interface MainLayoutProps {
  children: React.ReactNode;
}

// Note Component Types
export interface NoteFormProps {
  title: string;
  content: string;
  category: import('./notes').NoteCategory;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: import('./notes').NoteCategory) => void;
  isEditing?: boolean;
}

export interface NoteHeaderProps {
  isEditing: boolean;
  lastUpdated?: string;
  hasChanges?: boolean;
  isSaving?: boolean;
  canSave?: boolean;
  onSave?: () => void;
  onDelete?: () => void;
}