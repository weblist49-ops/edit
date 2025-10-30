import React from 'react';
import { Copy, Trash2, Eye, EyeOff, Lock, Unlock, MoveUp, MoveDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/contexts/EditorContext';

export const QuickActions: React.FC = () => {
  const {
    elements,
    selectedElementIds,
    duplicateElement,
    deleteElement,
    toggleElementVisibility,
    toggleElementLock,
    updateElement,
  } = useEditor();

  if (selectedElementIds.length !== 1) return null;

  const element = elements.find(el => el.id === selectedElementIds[0]);
  if (!element) return null;

  const handleBringForward = () => {
    const maxZIndex = Math.max(...elements.map(el => el.zIndex));
    if (element.zIndex < maxZIndex) {
      updateElement(element.id, { zIndex: element.zIndex + 1 });
      console.log('Element brought forward');
    }
  };

  const handleSendBackward = () => {
    if (element.zIndex > 1) {
      updateElement(element.id, { zIndex: element.zIndex - 1 });
      console.log('Element sent backward');
    }
  };

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 glass-effect rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-2 flex items-center gap-2 z-50 animate-fade-in">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          duplicateElement(element.id);
          console.log('Element duplicated via quick action');
        }}
        className="hover:bg-white/50 dark:hover:bg-gray-700/50 transition-smooth rounded-xl hover-lift"
        title="Duplicate (Ctrl+D)"
      >
        <Copy className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          toggleElementVisibility(element.id);
          console.log('Element visibility toggled via quick action');
        }}
        className="hover:bg-white/50 dark:hover:bg-gray-700/50 transition-smooth rounded-xl hover-lift"
        title="Toggle Visibility"
      >
        {element.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          toggleElementLock(element.id);
          console.log('Element lock toggled via quick action');
        }}
        className="hover:bg-white/50 dark:hover:bg-gray-700/50 transition-smooth rounded-xl hover-lift"
        title="Toggle Lock"
      >
        {element.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
      </Button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

      <Button
        variant="ghost"
        size="sm"
        onClick={handleBringForward}
        className="hover:bg-white/50 dark:hover:bg-gray-700/50 transition-smooth rounded-xl hover-lift"
        title="Bring Forward"
      >
        <MoveUp className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleSendBackward}
        className="hover:bg-white/50 dark:hover:bg-gray-700/50 transition-smooth rounded-xl hover-lift"
        title="Send Backward"
      >
        <MoveDown className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          deleteElement(element.id);
          console.log('Element deleted via quick action');
        }}
        className="hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-smooth rounded-xl hover-lift"
        title="Delete (Del)"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};