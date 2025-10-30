import React, { useRef, useState, useEffect } from 'react';
import { Box, Sparkles } from 'lucide-react';
import { useEditor } from '@/contexts/EditorContext';
import { CanvasElement } from './CanvasElement';
import { ElementType } from '@/types/editor';
import { getDefaultElement } from '@/utils/elementDefaults';

interface CanvasProps {
  draggedType: ElementType | null;
}

export const Canvas: React.FC<CanvasProps> = ({ draggedType }) => {
  const {
    elements,
    selectedElementIds,
    deviceMode,
    showGrid,
    zoom,
    canvasX,
    canvasY,
    addElement,
    clearSelection,
    setCanvasPosition,
    selectMultipleElements,
  } = useEditor();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });

  const canvasSizes = {
    desktop: { width: 1200, height: 800 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 },
  };

  const { width: canvasWidth, height: canvasHeight } = canvasSizes[deviceMode];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvasX) / (zoom / 100);
    const y = (e.clientY - rect.top - canvasY) / (zoom / 100);

    const newElement = getDefaultElement(draggedType, x, y);
    addElement(newElement);
    console.log('Element dropped on canvas:', draggedType, { x, y });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasX, y: e.clientY - canvasY });
      e.preventDefault();
      console.log('Panning started');
    } else if (e.button === 0 && !e.shiftKey && e.target === canvasRef.current) {
      setIsSelecting(true);
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - canvasX) / (zoom / 100);
      const y = (e.clientY - rect.top - canvasY) / (zoom / 100);
      setSelectionStart({ x, y });
      setSelectionBox({ x, y, width: 0, height: 0 });
      console.log('Selection started');
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasPosition(e.clientX - panStart.x, e.clientY - panStart.y);
    } else if (isSelecting && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentX = (e.clientX - rect.left - canvasX) / (zoom / 100);
      const currentY = (e.clientY - rect.top - canvasY) / (zoom / 100);

      const width = currentX - selectionStart.x;
      const height = currentY - selectionStart.y;

      setSelectionBox({
        x: width < 0 ? currentX : selectionStart.x,
        y: height < 0 ? currentY : selectionStart.y,
        width: Math.abs(width),
        height: Math.abs(height),
      });
    }
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      const selectedIds = elements
        .filter(el => {
          if (el.position !== 'absolute') return false;
          return (
            el.x >= selectionBox.x &&
            el.x + el.width <= selectionBox.x + selectionBox.width &&
            el.y >= selectionBox.y &&
            el.y + el.height <= selectionBox.y + selectionBox.height
          );
        })
        .map(el => el.id);

      if (selectedIds.length > 0) {
        selectMultipleElements(selectedIds);
        console.log('Multi-selection completed:', selectedIds.length, 'elements');
      }
      setIsSelecting(false);
      setSelectionBox({ x: 0, y: 0, width: 0, height: 0 });
    }
    if (isPanning) {
      console.log('Panning ended');
    }
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      const newZoom = Math.max(25, Math.min(400, zoom + delta));
      useEditor.getState().setZoom(newZoom);
      console.log('Zoom changed:', newZoom);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsPanning(false);
      setIsSelecting(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div
      ref={canvasRef}
      className="flex-1 overflow-hidden relative gradient-bg-subtle"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onClick={(e) => {
        if (e.target === canvasRef.current) {
          clearSelection();
          console.log('Selection cleared');
        }
      }}
      style={{ cursor: isPanning ? 'grabbing' : isSelecting ? 'crosshair' : 'default' }}
    >
      <div
        className="absolute transition-transform duration-200"
        style={{
          transform: `translate(${canvasX}px, ${canvasY}px) scale(${zoom / 100})`,
          transformOrigin: '0 0',
          left: '50%',
          top: '50%',
          marginLeft: -canvasWidth / 2,
          marginTop: -canvasHeight / 2,
        }}
      >
        <div
          className="relative bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            backgroundImage: showGrid
              ? 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 1px, transparent 1px)'
              : 'none',
            backgroundSize: showGrid ? '16px 16px' : 'auto',
          }}
        >
          {elements.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 animate-fade-in">
              <div className="relative mb-6">
                <Box className="w-20 h-20 text-indigo-300 dark:text-indigo-700" />
                <Sparkles className="w-8 h-8 text-purple-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Start Building
              </h2>
              <p className="text-center mb-6 text-gray-600 dark:text-gray-400 max-w-md px-4">
                Drag components from the left panel to create your design
              </p>
              <div className="text-sm space-y-2 text-center text-gray-500 dark:text-gray-500 bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
                <p className="flex items-center gap-2 justify-center">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Use manual controls for precise positioning
                </p>
                <p className="flex items-center gap-2 justify-center">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Hold Shift + Drag to pan the canvas
                </p>
                <p className="flex items-center gap-2 justify-center">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  Use mouse wheel to scroll, Ctrl + Wheel to zoom
                </p>
                <p className="flex items-center gap-2 justify-center">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  Use transform origin for rotation reference
                </p>
              </div>
            </div>
          )}

          {elements.map(element => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedElementIds.includes(element.id)}
              zoom={zoom}
            />
          ))}

          {isSelecting && (
            <div
              className="absolute border-2 border-indigo-500 bg-indigo-500/10 pointer-events-none rounded-lg backdrop-blur-sm"
              style={{
                left: selectionBox.x,
                top: selectionBox.y,
                width: selectionBox.width,
                height: selectionBox.height,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};