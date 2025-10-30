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
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [deviceMode, setDeviceModeState] = useState<DeviceMode>('desktop');
  const [showGrid, setShowGrid] = useState(true);
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

  const addElement = useCallback((element: Omit<CanvasElement, 'id' | 'zIndex'>) => {
    const newElement: CanvasElement = {
      ...element,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      zIndex: elements.length + 1,
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    saveToHistory(newElements);
    console.log('Element added:', newElement);
  }, [elements, saveToHistory]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    saveToHistory(newElements);
    console.log('Element updated:', id, updates);
  }, [elements, saveToHistory]);

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
    console.log('Element selected:', id);
  }, []);

  const selectMultipleElements = useCallback((ids: string[]) => {
    setSelectedElementIds(ids);
    console.log('Multiple elements selected:', ids);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedElementIds([]);
    console.log('Selection cleared');
  }, []);

  const setDeviceMode = useCallback((mode: DeviceMode) => {
    setDeviceModeState(mode);
    console.log('Device mode changed:', mode);
  }, []);

  const toggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
    console.log('Grid toggled');
  }, []);

  const setZoom = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(25, Math.min(400, newZoom));
    setZoomState(clampedZoom);
    console.log('Zoom changed:', clampedZoom);
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
      console.log('Undo performed');
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(JSON.parse(JSON.stringify(history[newIndex])));
      console.log('Redo performed');
    }
  }, [history, historyIndex]);

  const duplicateElement = useCallback((id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement: CanvasElement = {
        ...element,
        id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: element.x + 20,
        y: element.y + 20,
        zIndex: elements.length + 1,
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      saveToHistory(newElements);
      setSelectedElementIds([newElement.id]);
      console.log('Element duplicated:', newElement);
    }
  }, [elements, saveToHistory]);

  const toggleElementVisibility = useCallback((id: string) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, isVisible: !el.isVisible } : el
    );
    setElements(newElements);
    saveToHistory(newElements);
    console.log('Element visibility toggled:', id);
  }, [elements, saveToHistory]);

  const toggleElementLock = useCallback((id: string) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, isLocked: !el.isLocked } : el
    );
    setElements(newElements);
    saveToHistory(newElements);
    console.log('Element lock toggled:', id);
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, duplicateElement, deleteElement, clearSelection, selectedElementIds]);

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