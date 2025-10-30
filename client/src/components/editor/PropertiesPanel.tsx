import React from 'react';
import { Settings, Palette, Type, Layout, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useEditor } from '@/contexts/EditorContext';

export const PropertiesPanel: React.FC = () => {
  const { elements, selectedElementIds, updateElement } = useEditor();

  if (selectedElementIds.length !== 1) {
    return (
      <div className="w-80 h-full glass-effect border-l border-gray-200/50 dark:border-gray-700/50 overflow-y-auto animate-slide-in">
        <div className="p-6 flex flex-col items-center justify-center h-full text-center">
          <Settings className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No Element Selected
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Select an element to view and edit its properties
          </p>
        </div>
      </div>
    );
  }

  const element = elements.find(el => el.id === selectedElementIds[0]);
  if (!element) return null;

  const handleStyleUpdate = (styleKey: string, value: unknown) => {
    updateElement(element.id, {
      style: { ...element.style, [styleKey]: value }
    });
    console.log(`Style updated: ${styleKey} = ${value}`);
  };

  return (
    <div className="w-80 h-full glass-effect border-l border-gray-200/50 dark:border-gray-700/50 overflow-y-auto animate-slide-in">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <Settings className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Properties
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {element.name} • {element.type}
          </p>
        </div>

        <Tabs defaultValue="layout" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="layout" className="text-xs">
              <Layout className="w-3 h-3 mr-1" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              Style
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">
              <Layers className="w-3 h-3 mr-1" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="layout" className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                Position Type
              </Label>
              <Select
                value={element.position}
                onValueChange={(value: 'absolute' | 'relative') => {
                  updateElement(element.id, { position: value });
                  console.log(`Position type changed: ${value}`);
                }}
              >
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absolute">Absolute</SelectItem>
                  <SelectItem value="relative">Relative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                  Width Unit
                </Label>
                <Select
                  value={typeof element.style?.width === 'string' ? 'percent' : 'px'}
                  onValueChange={(value) => {
                    const newWidth = value === 'percent' ? '100%' : element.width;
                    handleStyleUpdate('width', newWidth);
                  }}
                >
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="px">Pixels</SelectItem>
                    <SelectItem value="percent">Percent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                  Height Unit
                </Label>
                <Select
                  value={typeof element.style?.height === 'string' ? 'percent' : 'px'}
                  onValueChange={(value) => {
                    const newHeight = value === 'percent' ? '100%' : element.height;
                    handleStyleUpdate('height', newHeight);
                  }}
                >
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="px">Pixels</SelectItem>
                    <SelectItem value="percent">Percent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                Padding
              </Label>
              <Input
                type="text"
                value={element.style?.padding || '0'}
                onChange={(e) => handleStyleUpdate('padding', e.target.value)}
                placeholder="e.g., 16px or 1rem"
                className="h-10 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                Margin
              </Label>
              <Input
                type="text"
                value={element.style?.margin || '0'}
                onChange={(e) => handleStyleUpdate('margin', e.target.value)}
                placeholder="e.g., 16px or 1rem"
                className="h-10 rounded-xl"
              />
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                Background Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={element.style?.backgroundColor || '#E5E7EB'}
                  onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                  className="h-10 w-16 rounded-xl cursor-pointer"
                />
                <Input
                  type="text"
                  value={element.style?.backgroundColor || '#E5E7EB'}
                  onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                  className="h-10 flex-1 rounded-xl"
                />
              </div>
            </div>

            {(element.type === 'text' || element.type === 'heading' || element.type === 'button') && (
              <>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                    Text Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={element.style?.color || '#111827'}
                      onChange={(e) => handleStyleUpdate('color', e.target.value)}
                      className="h-10 w-16 rounded-xl cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={element.style?.color || '#111827'}
                      onChange={(e) => handleStyleUpdate('color', e.target.value)}
                      className="h-10 flex-1 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                    Font Size: {element.style?.fontSize || 16}px
                  </Label>
                  <Slider
                    value={[element.style?.fontSize || 16]}
                    onValueChange={([value]) => handleStyleUpdate('fontSize', value)}
                    min={8}
                    max={72}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                    Font Weight
                  </Label>
                  <Select
                    value={element.style?.fontWeight || 'normal'}
                    onValueChange={(value) => handleStyleUpdate('fontWeight', value)}
                  >
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semi Bold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                    Text Align
                  </Label>
                  <Select
                    value={element.style?.textAlign || 'left'}
                    onValueChange={(value) => handleStyleUpdate('textAlign', value)}
                  >
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="justify">Justify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div>
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                Border Radius
              </Label>
              <Input
                type="text"
                value={element.style?.borderRadius || '0'}
                onChange={(e) => handleStyleUpdate('borderRadius', e.target.value)}
                placeholder="e.g., 8px or 0.5rem"
                className="h-10 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                Border Width: {element.style?.borderWidth || 0}px
              </Label>
              <Slider
                value={[element.style?.borderWidth || 0]}
                onValueChange={([value]) => handleStyleUpdate('borderWidth', value)}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {(element.style?.borderWidth || 0) > 0 && (
              <>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                    Border Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={element.style?.borderColor || '#000000'}
                      onChange={(e) => handleStyleUpdate('borderColor', e.target.value)}
                      className="h-10 w-16 rounded-xl cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={element.style?.borderColor || '#000000'}
                      onChange={(e) => handleStyleUpdate('borderColor', e.target.value)}
                      className="h-10 flex-1 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                    Border Style
                  </Label>
                  <Select
                    value={element.style?.borderStyle || 'solid'}
                    onValueChange={(value) => handleStyleUpdate('borderStyle', value)}
                  >
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                Z-Index: {element.zIndex}
              </Label>
              <Slider
                value={[element.zIndex]}
                onValueChange={([value]) => {
                  updateElement(element.id, { zIndex: value });
                  console.log(`Z-index changed: ${value}`);
                }}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                Element Name
              </Label>
              <Input
                type="text"
                value={element.name}
                onChange={(e) => {
                  updateElement(element.id, { name: e.target.value });
                  console.log(`Element name changed: ${e.target.value}`);
                }}
                className="h-10 rounded-xl"
              />
            </div>

            {element.type === 'grid' && (
              <>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                    Grid Columns
                  </Label>
                  <Input
                    type="text"
                    value={element.style?.gridTemplateColumns || 'repeat(3, 1fr)'}
                    onChange={(e) => handleStyleUpdate('gridTemplateColumns', e.target.value)}
                    placeholder="e.g., repeat(3, 1fr)"
                    className="h-10 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                    Grid Gap
                  </Label>
                  <Input
                    type="text"
                    value={element.style?.gap || '16px'}
                    onChange={(e) => handleStyleUpdate('gap', e.target.value)}
                    placeholder="e.g., 16px"
                    className="h-10 rounded-xl"
                  />
                </div>
              </>
            )}

            <div>
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                Display Mode
              </Label>
              <Select
                value={element.style?.display || 'block'}
                onValueChange={(value) => handleStyleUpdate('display', value)}
              >
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">Block</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="inline">Inline</SelectItem>
                  <SelectItem value="inline-block">Inline Block</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};