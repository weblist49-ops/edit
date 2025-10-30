export type ElementType = 
  | 'container' 
  | 'section' 
  | 'frame' 
  | 'grid' 
  | 'text' 
  | 'heading' 
  | 'button' 
  | 'image' 
  | 'video';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export type TransformOrigin = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface ElementStyle {
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: string;
  textAlign?: string;
  display?: string;
  gridTemplateColumns?: string;
  gap?: string;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  scale: number;
  transformOrigin: TransformOrigin;
  zIndex: number;
  isLocked: boolean;
  isVisible: boolean;
  content?: string;
  style?: ElementStyle;
  position: 'absolute' | 'relative';
}

export interface EditorState {
  elements: CanvasElement[];
  selectedElementIds: string[];
  deviceMode: DeviceMode;
  showGrid: boolean;
  zoom: number;
  canvasX: number;
  canvasY: number;
  history: CanvasElement[][];
  historyIndex: number;
}

export interface ComponentLibraryItem {
  type: ElementType;
  icon: string;
  label: string;
  category: 'layout' | 'content' | 'media';
}