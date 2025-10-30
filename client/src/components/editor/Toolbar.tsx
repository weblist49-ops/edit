import React from 'react';
import { Monitor, Tablet, Smartphone, Grid3x3, Undo2, Redo2, Download, Sparkles } from 'lucide-react';
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
  };

  return (
    <div className="h-16 glass-effect border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-1 backdrop-blur-sm">
          {deviceModes.map(({ mode, icon, label }) => (
            <Button
              key={mode}
              variant={deviceMode === mode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setDeviceMode(mode);
                console.log(`Device mode changed to: ${mode}`);
              }}
              className={`transition-smooth ${
                deviceMode === mode 
                  ? 'btn-brand shadow-lg' 
                  : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              title={label}
            >
              {icon}
            </Button>
          ))}
        </div>
        
        <Button
          variant={showGrid ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            toggleGrid();
            console.log(`Grid toggled: ${!showGrid}`);
          }}
          className={`transition-smooth rounded-xl ${
            showGrid 
              ? 'btn-brand shadow-lg' 
              : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
          }`}
          title="Toggle Grid"
        >
          <Grid3x3 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              undo();
              console.log('Undo action performed');
            }}
            disabled={!canUndo}
            className="hover:bg-white/50 dark:hover:bg-gray-700/50 disabled:opacity-30 transition-smooth rounded-lg"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              redo();
              console.log('Redo action performed');
            }}
            disabled={!canRedo}
            className="hover:bg-white/50 dark:hover:bg-gray-700/50 disabled:opacity-30 transition-smooth rounded-lg"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            handleExport();
            console.log('Export initiated');
          }}
          className="btn-brand shadow-lg hover-lift rounded-xl"
          title="Export"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};