import React from 'react';
import { useEditor } from '@/contexts/EditorContext';

export const PositionIndicator: React.FC = () => {
  const { canvasX, canvasY, zoom } = useEditor();

  return (
    <div className="fixed bottom-6 left-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 px-4 py-2 text-xs font-mono text-gray-600 dark:text-gray-400 z-50">
      X: {Math.round(canvasX)} Y: {Math.round(canvasY)} | Zoom: {zoom}%
    </div>
  );
};