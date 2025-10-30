import React from 'react';
import { Box, Type, Image, Video, Grid3x3, Layout, Square } from 'lucide-react';
import { ElementType } from '@/types/editor';

interface ComponentItem {
  type: ElementType;
  icon: React.ReactNode;
  label: string;
  category: string;
  color: string;
}

const components: ComponentItem[] = [
  { type: 'container', icon: <Layout className="w-5 h-5" />, label: 'Container', category: 'Layout', color: 'from-blue-500 to-cyan-500' },
  { type: 'section', icon: <Square className="w-5 h-5" />, label: 'Section', category: 'Layout', color: 'from-blue-500 to-cyan-500' },
  { type: 'frame', icon: <Box className="w-5 h-5" />, label: 'Frame', category: 'Layout', color: 'from-blue-500 to-cyan-500' },
  { type: 'grid', icon: <Grid3x3 className="w-5 h-5" />, label: 'Grid', category: 'Layout', color: 'from-blue-500 to-cyan-500' },
  { type: 'text', icon: <Type className="w-5 h-5" />, label: 'Text', category: 'Content', color: 'from-purple-500 to-pink-500' },
  { type: 'heading', icon: <Type className="w-5 h-5 font-bold" />, label: 'Heading', category: 'Content', color: 'from-purple-500 to-pink-500' },
  { type: 'button', icon: <Square className="w-5 h-5" />, label: 'Button', category: 'Content', color: 'from-purple-500 to-pink-500' },
  { type: 'image', icon: <Image className="w-5 h-5" />, label: 'Image', category: 'Media', color: 'from-emerald-500 to-teal-500' },
  { type: 'video', icon: <Video className="w-5 h-5" />, label: 'Video', category: 'Media', color: 'from-emerald-500 to-teal-500' },
];

interface ComponentLibraryProps {
  onDragStart: (type: ElementType) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onDragStart }) => {
  const categories = ['Layout', 'Content', 'Media'];

  return (
    <div className="w-72 h-full glass-effect border-r border-gray-200/50 dark:border-gray-700/50 overflow-y-auto animate-slide-in">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Components
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Drag to canvas to add
          </p>
        </div>
        
        {categories.map(category => {
          const categoryComponents = components.filter(comp => comp.category === category);
          return (
            <div key={category} className="mb-8 animate-fade-in">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className={`w-1 h-4 rounded-full bg-gradient-to-b ${categoryComponents[0]?.color}`} />
                {category}
              </h3>
              <div className="space-y-2">
                {categoryComponents.map(component => (
                  <div
                    key={component.type}
                    draggable
                    onDragStart={() => {
                      onDragStart(component.type);
                      console.log(`Dragging component: ${component.type}`);
                    }}
                    className="group flex items-center gap-3 p-3 rounded-xl cursor-move hover-lift
                             bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50
                             hover:border-indigo-300 dark:hover:border-indigo-600 transition-smooth"
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${component.color} text-white
                                   group-hover:scale-110 transition-transform`}>
                      {component.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {component.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};