import React from 'react';
import { Plus, Minus, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditor } from '@/contexts/EditorContext';

export const ZoomControls: React.FC = () => {
  const { zoom, setZoom, setCanvasPosition } = useEditor();

  const zoomLevels = [25, 50, 75, 100, 125, 150, 200, 400];

  const handleZoomIn = () => {
    const newZoom = zoom + 25;
    setZoom(newZoom);
    console.log(`Zoom in: ${newZoom}%`);
  };

  const handleZoomOut = () => {
    const newZoom = zoom - 25;
    setZoom(newZoom);
    console.log(`Zoom out: ${newZoom}%`);
  };

  const handleReset = () => {
    setZoom(100);
    setCanvasPosition(0, 0);
    console.log('View reset to 100%');
  };

  return (
    <div className="fixed top-24 right-6 glass-effect rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-2 flex items-center gap-2 z-50 animate-fade-in">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomOut}
        disabled={zoom <= 25}
        className="hover:bg-white/50 dark:hover:bg-gray-700/50 disabled:opacity-30 transition-smooth rounded-xl hover-lift"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </Button>
      
      <Select value={zoom.toString()} onValueChange={(value) => {
        setZoom(Number(value));
        console.log(`Zoom changed to: ${value}%`);
      }}>
        <SelectTrigger className="w-28 h-9 rounded-xl border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
          <SelectValue>{zoom}%</SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-gray-200 dark:border-gray-700">
          {zoomLevels.map(level => (
            <SelectItem key={level} value={level.toString()} className="rounded-lg">
              {level}%
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomIn}
        disabled={zoom >= 400}
        className="hover:bg-white/50 dark:hover:bg-gray-700/50 disabled:opacity-30 transition-smooth rounded-xl hover-lift"
        title="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReset}
        className="hover:bg-white/50 dark:hover:bg-gray-700/50 transition-smooth rounded-xl hover-lift"
        title="Reset View"
      >
        <Maximize2 className="w-4 h-4" />
      </Button>
    </div>
  );
};