import { NodeViewWrapper, NodeViewProps, ReactNodeViewRenderer } from '@tiptap/react';
import { Image as TipTapImage } from '@tiptap/extension-image';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

const ResizableImageTemplate = ({ node, updateAttributes }: NodeViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [editing, setEditing] = useState(false);
  const [resizingStyle, setResizingStyle] = useState<Pick<CSSProperties, 'width'> | undefined>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setEditing(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [editing]);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    event.preventDefault();
    setEditing(true);

    const direction = event.currentTarget.dataset.direction || '--';
    const initialXPosition = event.clientX;
    const currentWidth = imgRef.current.width;
    let newWidth = currentWidth;
    const transform = direction[1] === 'w' ? -1 : 1;

    const mouseMoveHandler = (event: MouseEvent) => {
      newWidth = Math.max(currentWidth + (transform * (event.clientX - initialXPosition)), 60); // MIN_WIDTH = 60
      setResizingStyle({ width: newWidth });
      if (!event.buttons) removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', removeListeners);
      updateAttributes({ width: newWidth });
      setResizingStyle(undefined);
      setEditing(false); // End editing on mouse up
    };

    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', removeListeners);
  }, [updateAttributes]);

  const BORDER_COLOR = '#888'; // Changed to a subtle gray

  const dragCornerButton = (direction: string) => (
    <div
      role="button"
      tabIndex={0}
      onMouseDown={handleMouseDown}
      data-direction={direction}
      style={{
        position: 'absolute',
        height: '8px', // Slightly smaller handles
        width: '8px', // Slightly smaller handles
        backgroundColor: BORDER_COLOR,
        border: '1px solid #fff', // White border for contrast
        borderRadius: '50%', // Make them circular
        ...({ n: { top: '-4px' }, s: { bottom: '-4px' } }[direction[0] as 'n' | 's']),
        ...({ w: { left: '-4px' }, e: { right: '-4px' } }[direction[1] as 'w' | 'e']),
        cursor: `${direction}-resize`,
      }}
    />
  );

  return (
    <NodeViewWrapper
      ref={containerRef}
      as="div"
      draggable
      data-drag-handle
      onClick={() => setEditing(true)}
      style={{
        overflow: 'hidden',
        position: 'relative',
        display: 'inline-block',
        lineHeight: '0px',
        outline: editing ? `1px solid ${BORDER_COLOR}` : 'none', // Outline for the image
      }}
    >
      <img
        {...node.attrs}
        ref={imgRef}
        style={{
          ...resizingStyle,
          cursor: 'default',
        }}
      />
      {editing && (
        <>
          {dragCornerButton("nw")}
          {dragCornerButton("ne")}
          {dragCornerButton("sw")}
          {dragCornerButton("se")}
        </>
      )}
    </NodeViewWrapper>
  );
};

export const ResizableImage = TipTapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.style.width || element.getAttribute('width'),
        renderHTML: attributes => {
          if (attributes.width) {
            return { width: attributes.width };
          }
          return {};
        },
      },
      height: {
        default: null,
        parseHTML: element => element.style.height || element.getAttribute('height'),
        renderHTML: attributes => {
          if (attributes.height) {
            return { height: attributes.height };
          }
          return {};
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageTemplate);
  },
}).configure({ inline: true, allowBase64: true }); 