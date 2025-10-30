import React, { useState } from 'react';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import { Eye, EyeOff, Lock, Unlock, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/contexts/EditorContext';
import { CanvasElement as CanvasElementType } from '@/types/editor';

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  zoom: number;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({ element, isSelected, zoom }) => {
  const { updateElement, selectElement, toggleElementVisibility, toggleElementLock } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(element.content || '');

  if (!element.isVisible) return null;

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    if (!element.isLocked && element.position === 'absolute') {
      updateElement(element.id, { x: data.x, y: data.y });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!element.isLocked) {
      selectElement(element.id, e.ctrlKey || e.metaKey);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!element.isLocked && (element.type === 'text' || element.type === 'heading' || element.type === 'button')) {
      setIsEditing(true);
      setEditContent(element.content || '');
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editContent !== element.content) {
      updateElement(element.id, { content: editContent });
    }
  };

  const getTransformOriginStyle = () => {
    const origins = {
      'center': '50% 50%',
      'top-left': '0% 0%',
      'top-right': '100% 0%',
      'bottom-left': '0% 100%',
      'bottom-right': '100% 100%',
    };
    return origins[element.transformOrigin];
  };

  const elementStyle: React.CSSProperties = {
    width: element.style?.width || element.width,
    height: element.style?.height || element.height,
    backgroundColor: element.style?.backgroundColor,
    color: element.style?.color,
    fontSize: element.style?.fontSize,
    fontWeight: element.style?.fontWeight,
    padding: element.style?.padding,
    margin: element.style?.margin,
    borderRadius: element.style?.borderRadius,
    borderWidth: element.style?.borderWidth,
    borderColor: element.style?.borderColor,
    borderStyle: element.style?.borderStyle,
    textAlign: element.style?.textAlign as React.CSSProperties['textAlign'],
    display: element.style?.display,
    gridTemplateColumns: element.style?.gridTemplateColumns,
    gap: element.style?.gap,
    opacity: element.opacity / 100,
    transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
    transformOrigin: getTransformOriginStyle(),
    cursor: element.isLocked ? 'not-allowed' : 'move',
    zIndex: element.zIndex,
    position: element.position,
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <input
          type="text"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="w-full h-full bg-transparent outline-none"
          style={{ fontSize: element.style?.fontSize, color: element.style?.color }}
        />
      );
    }

    switch (element.type) {
      case 'text':
      case 'heading':
      case 'button':
        return <div className="flex items-center justify-center h-full">{element.content}</div>;
      case 'image':
        return (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
        );
      case 'video':
        return (
          <div className="flex items-center justify-center h-full">
            <VideoIcon className="w-12 h-12 text-gray-400" />
          </div>
        );
      case 'grid':
        return (
          <div className="grid h-full" style={{ gridTemplateColumns: element.style?.gridTemplateColumns, gap: element.style?.gap }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700" />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const content = (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`
        transition-all duration-200
        ${isSelected ? 'ring-2 ring-indigo-500' : 'hover:ring-2 hover:ring-indigo-300'}
        ${element.isLocked ? 'opacity-50' : ''}
      `}
      style={elementStyle}
    >
      {renderContent()}
      {isSelected && (
        <div className="absolute -top-8 left-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded flex items-center gap-2 whitespace-nowrap">
          <span>{element.name}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-indigo-700"
            onClick={(e) => {
              e.stopPropagation();
              toggleElementVisibility(element.id);
            }}
          >
            {element.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-indigo-700"
            onClick={(e) => {
              e.stopPropagation();
              toggleElementLock(element.id);
            }}
          >
            {element.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </Button>
        </div>
      )}
    </div>
  );

  if (element.position === 'absolute') {
    return (
      <Draggable
        position={{ x: element.x, y: element.y }}
        onDrag={handleDrag}
        disabled={element.isLocked}
        scale={zoom / 100}
      >
        {content}
      </Draggable>
    );
  }

  return content;
};