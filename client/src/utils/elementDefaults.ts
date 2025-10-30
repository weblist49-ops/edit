import { ElementType, CanvasElement } from '@/types/editor';

export const getDefaultElement = (
  type: ElementType,
  x: number,
  y: number
): Omit<CanvasElement, 'id' | 'zIndex'> => {
  const baseElement = {
    type,
    name: type.charAt(0).toUpperCase() + type.slice(1),
    x,
    y,
    rotation: 0,
    opacity: 100,
    scale: 1,
    transformOrigin: 'center' as const,
    isLocked: false,
    isVisible: true,
  };

  switch (type) {
    case 'frame':
      return {
        ...baseElement,
        width: 300,
        height: 200,
        position: 'absolute',
        style: {
          backgroundColor: '#E5E7EB',
          borderRadius: '8px',
        },
      };
    case 'container':
      return {
        ...baseElement,
        width: 0,
        height: 200,
        position: 'relative',
        style: {
          width: '100%',
          backgroundColor: '#F3F4F6',
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: '#9CA3AF',
        },
      };
    case 'section':
      return {
        ...baseElement,
        width: 0,
        height: 200,
        position: 'relative',
        style: {
          width: '100%',
          backgroundColor: '#F9FAFB',
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: '#D1D5DB',
        },
      };
    case 'grid':
      return {
        ...baseElement,
        width: 0,
        height: 300,
        position: 'relative',
        style: {
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          padding: '16px',
          backgroundColor: '#F3F4F6',
        },
        content: 'grid-3-cols',
      };
    case 'text':
      return {
        ...baseElement,
        width: 200,
        height: 24,
        position: 'absolute',
        content: 'Text content',
        style: {
          fontSize: 16,
          color: '#111827',
        },
      };
    case 'heading':
      return {
        ...baseElement,
        width: 300,
        height: 40,
        position: 'absolute',
        content: 'Heading',
        style: {
          fontSize: 32,
          fontWeight: 'bold',
          color: '#111827',
        },
      };
    case 'button':
      return {
        ...baseElement,
        width: 120,
        height: 40,
        position: 'absolute',
        content: 'Button',
        style: {
          backgroundColor: '#6366F1',
          color: '#FFFFFF',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: 14,
          fontWeight: '600',
          textAlign: 'center',
        },
      };
    case 'image':
      return {
        ...baseElement,
        width: 200,
        height: 200,
        position: 'absolute',
        style: {
          backgroundColor: '#E5E7EB',
          borderRadius: '4px',
        },
      };
    case 'video':
      return {
        ...baseElement,
        width: 320,
        height: 180,
        position: 'absolute',
        style: {
          backgroundColor: '#D1D5DB',
          borderRadius: '4px',
        },
      };
    default:
      return {
        ...baseElement,
        width: 100,
        height: 100,
        position: 'absolute',
      };
  }
};