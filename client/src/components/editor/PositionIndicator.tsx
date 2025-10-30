import React from 'react';
import { Crosshair } from 'lucide-react';
import { useEditor } from '@/contexts/EditorContext';

export const PositionIndicator: React.FC = () => {
  const { canvasX, canvasY, zoom } = useEditor();

  return (
    <div className="fixed bottom-6 left-6 glass-effect rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 px-4 py-2 text-xs font-mono z-50 flex items-center gap-3 animate-fade-in">
      <Crosshair className="w-4 h-4 text-indigo-500" />
      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="font-semibold text-gray-700 dark:text-gray-300">X:</span>
          {Math.round(canvasX)}
        </span>
        <span className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
        <span className="flex items-center gap-1">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Y:</span>
          {Math.round(canvasY)}
        </span>
        <span className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
        <span className="flex items-center gap-1">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Zoom:</span>
          {zoom}%
        </span>
      </div>
    </div>
  );
};