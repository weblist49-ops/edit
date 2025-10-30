import React from 'react';
import { Box, Type, Image, Video, Grid3x3, Layout, Square } from 'lucide-react';
import { ElementType } from '@/types/editor';

interface ComponentItem {
  type: ElementType;
  icon: React.ReactNode;
  label: string;
  category: string;
}

const components: ComponentItem[] = [
  { type: 'container', icon: <Layout className="w-6 h-6" />, label: 'Container', category: 'Layout' },
  { type: 'section', icon: <Square className="w-6 h-6" />, label: 'Section', category: 'Layout' },
  { type: 'frame', icon: <Box className="w-6 h-6" />, label: 'Frame', category: 'Layout' },
  { type: 'grid', icon: <Grid3x3 className="w-6 h-6" />, label: 'Grid', category: 'Layout' },
  { type: 'text', icon: <Type className="w-6 h-6" />, label: 'Text', category: 'Content' },
  { type: 'heading', icon: <Type className="w-6 h-6 font-bold" />, label: 'Heading', category: 'Content' },
  { type: 'button', icon: <Square className="w-6 h-6" />, label: 'Button', category: 'Content' },
  { type: 'image', icon: <Image className="w-6 h-6" />, label: 'Image', category: 'Media' },
  { type: 'video', icon: <Video className="w-6 h-6" />, label: 'Video', category: 'Media' },
];

interface ComponentLibraryProps {
  onDragStart: (type: ElementType) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onDragStart }) => {
  const categories = ['Layout', 'Content', 'Media'];

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Components</h2>
        {categories.map(category => (
          <div key={category} className="mb-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {category}
            </h3>
            <div className="space-y-1">
              {components
                .filter(comp => comp.category === category)
                .map(component => (
                  <div
                    key={component.type}
                    draggable
                    onDragStart={() => onDragStart(component.type)}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-move hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                  >
                    <div className="text-indigo-600 dark:text-indigo-400">
                      {component.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {component.label}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};