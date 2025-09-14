// Layout Component Types
export interface MainLayoutProps {
  children: React.ReactNode;
}

// Dashboard Component Types
export interface DashboardProps {
  className?: string;
}

export interface DashboardStats {
  totalNotes: number;
  recentNotes: number;
  lastUpdated: string;
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

export interface NoteCardProps {
  note: import('./notes').Note;
}

// Editor Component Types
export interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}

// Generic Component Props
export interface ComponentWithChildren {
  children: React.ReactNode;
}

export interface ComponentWithClassName {
  className?: string;
}

export interface ComponentWithChildrenAndClassName extends ComponentWithChildren, ComponentWithClassName {}
