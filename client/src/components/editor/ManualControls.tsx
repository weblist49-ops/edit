import React from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEditor } from '@/contexts/EditorContext';
import { TransformOrigin } from '@/types/editor';

export const ManualControls: React.FC = () => {
  const { elements, selectedElementIds, updateElement } = useEditor();

  if (selectedElementIds.length !== 1) return null;

  const element = elements.find(el => el.id === selectedElementIds[0]);
  if (!element || element.position !== 'absolute') return null;

  const transformOrigins: { value: TransformOrigin; label: string }[] = [
    { value: 'center', label: 'Center' },
    { value: 'top-left', label: 'TL' },
    { value: 'top-right', label: 'TR' },
    { value: 'bottom-left', label: 'BL' },
    { value: 'bottom-right', label: 'BR' },
  ];

  const handleRotate = (degrees: number) => {
    const newRotation = (element.rotation + degrees) % 360;
    updateElement(element.id, { rotation: newRotation < 0 ? newRotation + 360 : newRotation });
  };

  return (
    <div className="fixed top-24 left-72 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4 z-50 w-80">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Manual Controls</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400">X Position</Label>
            <Input
              type="number"
              value={Math.round(element.x)}
              onChange={(e) => updateElement(element.id, { x: Number(e.target.value) })}
              className="h-8 mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400">Y Position</Label>
            <Input
              type="number"
              value={Math.round(element.y)}
              onChange={(e) => updateElement(element.id, { y: Number(e.target.value) })}
              className="h-8 mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400">Width</Label>
            <Input
              type="number"
              value={Math.round(element.width)}
              onChange={(e) => updateElement(element.id, { width: Number(e.target.value) })}
              className="h-8 mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400">Height</Label>
            <Input
              type="number"
              value={Math.round(element.height)}
              onChange={(e) => updateElement(element.id, { height: Number(e.target.value) })}
              className="h-8 mt-1"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Rotation</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRotate(-15)}
              className="h-8"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              value={Math.round(element.rotation)}
              onChange={(e) => updateElement(element.id, { rotation: Number(e.target.value) % 360 })}
              className="h-8 flex-1"
              min={0}
              max={360}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRotate(15)}
              className="h-8"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400">Opacity</Label>
            <Input
              type="number"
              value={Math.round(element.opacity)}
              onChange={(e) => updateElement(element.id, { opacity: Math.max(0, Math.min(100, Number(e.target.value))) })}
              className="h-8 mt-1"
              min={0}
              max={100}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400">Scale</Label>
            <Input
              type="number"
              step="0.1"
              value={element.scale}
              onChange={(e) => updateElement(element.id, { scale: Number(e.target.value) })}
              className="h-8 mt-1"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Transform Origin</Label>
          <div className="flex gap-1">
            {transformOrigins.map(({ value, label }) => (
              <Button
                key={value}
                variant={element.transformOrigin === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateElement(element.id, { transformOrigin: value })}
                className={`flex-1 h-8 ${element.transformOrigin === value ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};