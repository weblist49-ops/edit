import React from 'react';
import { RotateCcw, RotateCw, Move, Maximize2 } from 'lucide-react';
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

  const transformOrigins: { value: TransformOrigin; label: string; icon: string }[] = [
    { value: 'center', label: 'Center', icon: '⊙' },
    { value: 'top-left', label: 'TL', icon: '⌜' },
    { value: 'top-right', label: 'TR', icon: '⌝' },
    { value: 'bottom-left', label: 'BL', icon: '⌞' },
    { value: 'bottom-right', label: 'BR', icon: '⌟' },
  ];

  const handleRotate = (degrees: number) => {
    const newRotation = (element.rotation + degrees) % 360;
    updateElement(element.id, { rotation: newRotation < 0 ? newRotation + 360 : newRotation });
    console.log(`Element rotated: ${degrees}°, new rotation: ${newRotation}°`);
  };

  return (
    <div className="fixed top-24 left-80 glass-effect rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 z-50 w-96 animate-fade-in">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
          <Move className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Manual Controls
        </h3>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">X Position</Label>
            <Input
              type="number"
              value={Math.round(element.x)}
              onChange={(e) => {
                updateElement(element.id, { x: Number(e.target.value) });
                console.log(`X position updated: ${e.target.value}`);
              }}
              className="h-10 rounded-xl border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 transition-smooth"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">Y Position</Label>
            <Input
              type="number"
              value={Math.round(element.y)}
              onChange={(e) => {
                updateElement(element.id, { y: Number(e.target.value) });
                console.log(`Y position updated: ${e.target.value}`);
              }}
              className="h-10 rounded-xl border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 transition-smooth"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">Width</Label>
            <Input
              type="number"
              value={Math.round(element.width)}
              onChange={(e) => {
                updateElement(element.id, { width: Number(e.target.value) });
                console.log(`Width updated: ${e.target.value}`);
              }}
              className="h-10 rounded-xl border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 transition-smooth"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">Height</Label>
            <Input
              type="number"
              value={Math.round(element.height)}
              onChange={(e) => {
                updateElement(element.id, { height: Number(e.target.value) });
                console.log(`Height updated: ${e.target.value}`);
              }}
              className="h-10 rounded-xl border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 transition-smooth"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">Rotation</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRotate(-15)}
              className="h-10 rounded-xl hover-lift border-gray-200 dark:border-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              value={Math.round(element.rotation)}
              onChange={(e) => {
                updateElement(element.id, { rotation: Number(e.target.value) % 360 });
                console.log(`Rotation updated: ${e.target.value}°`);
              }}
              className="h-10 flex-1 rounded-xl border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 transition-smooth"
              min={0}
              max={360}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRotate(15)}
              className="h-10 rounded-xl hover-lift border-gray-200 dark:border-gray-700"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">Opacity</Label>
            <Input
              type="number"
              value={Math.round(element.opacity)}
              onChange={(e) => {
                updateElement(element.id, { opacity: Math.max(0, Math.min(100, Number(e.target.value))) });
                console.log(`Opacity updated: ${e.target.value}%`);
              }}
              className="h-10 rounded-xl border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 transition-smooth"
              min={0}
              max={100}
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">Scale</Label>
            <Input
              type="number"
              step="0.1"
              value={element.scale}
              onChange={(e) => {
                updateElement(element.id, { scale: Number(e.target.value) });
                console.log(`Scale updated: ${e.target.value}`);
              }}
              className="h-10 rounded-xl border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 transition-smooth"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 block">Transform Origin</Label>
          <div className="flex gap-2">
            {transformOrigins.map(({ value, label, icon }) => (
              <Button
                key={value}
                variant={element.transformOrigin === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  updateElement(element.id, { transformOrigin: value });
                  console.log(`Transform origin updated: ${value}`);
                }}
                className={`flex-1 h-10 rounded-xl transition-smooth ${
                  element.transformOrigin === value 
                    ? 'btn-brand shadow-lg' 
                    : 'hover-lift border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className="text-lg mr-1">{icon}</span>
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};