import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CanvasElement, EditorState, DeviceMode, TransformOrigin, ElementType } from '@/types/editor';

interface EditorContextType extends EditorState {
  addElement: (element: Omit<CanvasElement, 'id' | 'zIndex'>) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  setDeviceMode: (mode: DeviceMode) => void;
  toggleGrid: () => void;
  setZoom: (zoom: number) => void;
  setCanvasPosition: (x: number, y: number) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  duplicateElement: (id: string) => void;
  toggleElementVisibility: (id: string) => void;
  toggleElementLock: (id: string) => void;
  selectMultipleElements: (ids: string[]) => void;
  snapToGrid: boolean;
  toggleSnapToGrid: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [deviceMode, setDeviceModeState] = useState<DeviceMode>('desktop');
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [zoom, setZoomState] = useState(100);
  const [canvasX, setCanvasX] = useState(0);
  const [canvasY, setCanvasY] = useState(0);
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveToHistory = useCallback((newElements: CanvasElement[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newElements)));
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const snapValue = useCallback((value: number, gridSize: number = 16): number => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid]);

  const addElement = useCallback((element: Omit<CanvasElement, 'id' | 'zIndex'>) => {
    const snappedElement = {
      ...element,
      x: snapValue(element.x),
      y: snapValue(element.y),
    };
    
    const newElement: CanvasElement = {
      ...snappedElement,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      zIndex: elements.length + 1,
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    saveToHistory(newElements);
    console.log('Element added:', newElement.type, 'at position:', { x: newElement.x, y: newElement.y });
  }, [elements, saveToHistory, snapValue]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    const snappedUpdates = { ...updates };
    if (updates.x !== undefined) {
      snappedUpdates.x = snapValue(updates.x);
    }
    if (updates.y !== undefined) {
      snappedUpdates.y = snapValue(updates.y);
    }
    
    const newElements = elements.map(el =>
      el.id === id ? { ...el, ...snappedUpdates } : el
    );
    setElements(newElements);
    saveToHistory(newElements);
    console.log('Element updated:', id, snappedUpdates);
  }, [elements, saveToHistory, snapValue]);

  const deleteElement = useCallback((id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    setSelectedElementIds(prev => prev.filter(selectedId => selectedId !== id));
    saveToHistory(newElements);
    console.log('Element deleted:', id);
  }, [elements, saveToHistory]);

  const selectElement = useCallback((id: string, multiSelect = false) => {
    if (multiSelect) {
      setSelectedElementIds(prev =>
        prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
      );
    } else {
      setSelectedElementIds([id]);
    }
    console.log('Element selected:', id, multiSelect ? '(multi-select)' : '');
  }, []);

  const selectMultipleElements = useCallback((ids: string[]) => {
    setSelectedElementIds(ids);
    console.log('Multiple elements selected:', ids.length, 'elements');
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedElementIds([]);
    console.log('Selection cleared');
  }, []);

  const setDeviceMode = useCallback((mode: DeviceMode) => {
    setDeviceModeState(mode);
    console.log('Device mode changed to:', mode);
  }, []);

  const toggleGrid = useCallback(() => {
    setShowGrid(prev => {
      console.log('Grid toggled:', !prev ? 'visible' : 'hidden');
      return !prev;
    });
  }, []);

  const toggleSnapToGrid = useCallback(() => {
    setSnapToGrid(prev => {
      console.log('Snap to grid toggled:', !prev ? 'enabled' : 'disabled');
      return !prev;
    });
  }, []);

  const setZoom = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(25, Math.min(400, newZoom));
    setZoomState(clampedZoom);
    console.log('Zoom changed to:', clampedZoom + '%');
  }, []);

  const setCanvasPosition = useCallback((x: number, y: number) => {
    setCanvasX(x);
    setCanvasY(y);
  }, []);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(JSON.parse(JSON.stringify(history[newIndex])));
      console.log('Undo performed, history index:', newIndex);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(JSON.parse(JSON.stringify(history[newIndex])));
      console.log('Redo performed, history index:', newIndex);
    }
  }, [history, historyIndex]);

  const duplicateElement = useCallback((id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement: CanvasElement = {
        ...element,
        id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: snapValue(element.x + 20),
        y: snapValue(element.y + 20),
        zIndex: elements.length + 1,
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      saveToHistory(newElements);
      setSelectedElementIds([newElement.id]);
      console.log('Element duplicated:', element.type, 'new ID:', newElement.id);
    }
  }, [elements, saveToHistory, snapValue]);

  const toggleElementVisibility = useCallback((id: string) => {
    const newElements = elements.map(el =>
      el.id === id ? { ...el, isVisible: !el.isVisible } : el
    );
    setElements(newElements);
    saveToHistory(newElements);
    const element = elements.find(el => el.id === id);
    console.log('Element visibility toggled:', id, element?.isVisible ? 'hidden' : 'visible');
  }, [elements, saveToHistory]);

  const toggleElementLock = useCallback((id: string) => {
    const newElements = elements.map(el =>
      el.id === id ? { ...el, isLocked: !el.isLocked } : el
    );
    setElements(newElements);
    saveToHistory(newElements);
    const element = elements.find(el => el.id === id);
    console.log('Element lock toggled:', id, element?.isLocked ? 'unlocked' : 'locked');
  }, [elements, saveToHistory]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'Z' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (selectedElementIds.length === 1) {
          duplicateElement(selectedElementIds[0]);
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementIds.length > 0 && document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          selectedElementIds.forEach(id => deleteElement(id));
        }
      } else if (e.key === 'Escape') {
        clearSelection();
      } else if (e.key.startsWith('Arrow') && selectedElementIds.length === 1) {
        e.preventDefault();
        const element = elements.find(el => el.id === selectedElementIds[0]);
        if (element && !element.isLocked && element.position === 'absolute') {
          const step = e.shiftKey ? 10 : 1;
          let newX = element.x;
          let newY = element.y;
          
          if (e.key === 'ArrowLeft') newX -= step;
          if (e.key === 'ArrowRight') newX += step;
          if (e.key === 'ArrowUp') newY -= step;
          if (e.key === 'ArrowDown') newY += step;
          
          updateElement(element.id, { x: newX, y: newY });
          console.log('Element nudged:', e.key, step + 'px');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, duplicateElement, deleteElement, clearSelection, selectedElementIds, elements, updateElement]);

  return (
    <EditorContext.Provider
      value={{
        elements,
        selectedElementIds,
        deviceMode,
        showGrid,
        zoom,
        canvasX,
        canvasY,
        history,
        historyIndex,
        addElement,
        updateElement,
        deleteElement,
        selectElement,
        clearSelection,
        setDeviceMode,
        toggleGrid,
        setZoom,
        setCanvasPosition,
        undo,
        redo,
        canUndo,
        canRedo,
        duplicateElement,
        toggleElementVisibility,
        toggleElementLock,
        selectMultipleElements,
        snapToGrid,
        toggleSnapToGrid,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
};