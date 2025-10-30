import React, { useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const KeyboardShortcuts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: ['Delete', 'Backspace'], action: 'Delete selected element(s)' },
    { keys: ['Ctrl', 'D'], action: 'Duplicate selected element' },
    { keys: ['Ctrl', 'Z'], action: 'Undo last action' },
    { keys: ['Ctrl', 'Shift', 'Z'], action: 'Redo action' },
    { keys: ['Shift', 'Drag'], action: 'Pan canvas' },
    { keys: ['Ctrl', 'Wheel'], action: 'Zoom in/out' },
    { keys: ['Escape'], action: 'Deselect all elements' },
    { keys: ['Arrow Keys'], action: 'Nudge element 1px' },
    { keys: ['Shift', 'Arrow Keys'], action: 'Nudge element 10px' },
    { keys: ['Ctrl', 'Click'], action: 'Multi-select elements' },
  ];

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 glass-effect rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover-lift z-50"
        title="Keyboard Shortcuts"
      >
        <Keyboard className="w-4 h-4 mr-2" />
        Shortcuts
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 glass-effect rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 z-50 w-96 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
            <Keyboard className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Keyboard Shortcuts
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 p-0 rounded-lg"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50"
          >
            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
              {shortcut.action}
            </span>
            <div className="flex gap-1">
              {shortcut.keys.map((key, keyIndex) => (
                <React.Fragment key={keyIndex}>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                    {key}
                  </kbd>
                  {keyIndex < shortcut.keys.length - 1 && (
                    <span className="text-gray-400 mx-1">+</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};