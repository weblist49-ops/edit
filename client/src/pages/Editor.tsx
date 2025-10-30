import React, { useState } from 'react';
import { ComponentLibrary } from '@/components/editor/ComponentLibrary';
import { Toolbar } from '@/components/editor/Toolbar';
import { Canvas } from '@/components/editor/Canvas';
import { ZoomControls } from '@/components/editor/ZoomControls';
import { PositionIndicator } from '@/components/editor/PositionIndicator';
import { ManualControls } from '@/components/editor/ManualControls';
import { EditorProvider } from '@/contexts/EditorContext';
import { ElementType } from '@/types/editor';

const EditorContent: React.FC = () => {
  const [draggedType, setDraggedType] = useState<ElementType | null>(null);

  const handleDragStart = (type: ElementType) => {
    setDraggedType(type);
    console.log('Drag started:', type);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <ComponentLibrary onDragStart={handleDragStart} />
        <Canvas draggedType={draggedType} />
      </div>
      <ZoomControls />
      <PositionIndicator />
      <ManualControls />
    </div>
  );
};

export const Editor: React.FC = () => {
  return (
    <EditorProvider>
      <EditorContent />
    </EditorProvider>
  );
};