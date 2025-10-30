import React from 'react';
import { Plus, Minus, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditor } from '@/contexts/EditorContext';

export const ZoomControls: React.FC = () => {
  const { zoom, setZoom, setCanvasPosition } = useEditor();

  const zoomLevels = [25, 50, 75, 100, 125, 150, 200, 400];

  const handleZoomIn = () => {
    setZoom(zoom + 25);
  };

  const handleZoomOut = () => {
    setZoom(zoom - 25);
  };

  const handleReset = () => {
    setZoom(100);
    setCanvasPosition(0, 0);
  };

  return (
    <div className="fixed top-24 right-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-2 flex items-center gap-2 z-50">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomOut}
        disabled={zoom <= 25}
        title="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <Select value={zoom.toString()} onValueChange={(value) => setZoom(Number(value))}>
        <SelectTrigger className="w-24 h-8">
          <SelectValue>{zoom}%</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {zoomLevels.map(level => (
            <SelectItem key={level} value={level.toString()}>
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
        title="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReset}
        title="Reset View"
      >
        <Maximize2 className="w-4 h-4" />
      </Button>
    </div>
  );
};