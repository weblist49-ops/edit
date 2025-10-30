import React from 'react';
import { Monitor, Tablet, Smartphone, Grid3x3, Undo2, Redo2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/contexts/EditorContext';
import { DeviceMode } from '@/types/editor';

export const Toolbar: React.FC = () => {
  const { deviceMode, setDeviceMode, showGrid, toggleGrid, undo, redo, canUndo, canRedo } = useEditor();

  const deviceModes: { mode: DeviceMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'desktop', icon: <Monitor className="w-4 h-4" />, label: 'Desktop' },
    { mode: 'tablet', icon: <Tablet className="w-4 h-4" />, label: 'Tablet' },
    { mode: 'mobile', icon: <Smartphone className="w-4 h-4" />, label: 'Mobile' },
  ];

  const handleExport = () => {
    console.log('Export functionality triggered');
    // Mock export - in real implementation would generate files
  };

  return (
    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {deviceModes.map(({ mode, icon, label }) => (
            <Button
              key={mode}
              variant={deviceMode === mode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceMode(mode)}
              className={deviceMode === mode ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
              title={label}
            >
              {icon}
            </Button>
          ))}
        </div>
        <Button
          variant={showGrid ? 'default' : 'ghost'}
          size="sm"
          onClick={toggleGrid}
          className={showGrid ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
          title="Toggle Grid"
        >
          <Grid3x3 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleExport}
          className="bg-indigo-600 hover:bg-indigo-700"
          title="Export"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};