import React, { useState, useRef, useEffect } from "react";
import { Image as KonvaImage, Rect } from "react-konva";
import { useTheme } from "../context/ThemeContext";
import BaseCanvasComponent, { BaseCanvasComponentProps } from "./BaseCanvasComponent";

interface ImageComponentProps extends Omit<BaseCanvasComponentProps, 'children' | 'width' | 'height'> {
  src: string;
  alt?: string;
  onResize?: (id: string, newSize: { width: number; height: number }) => void;
}

const ImageComponent = ({
  id,
  src,
  alt = "",
  x,
  y,
  isSelected,
  onSelect,
  onDragMove,
  onResize,
}: ImageComponentProps) => {
  const { isDarkMode } = useTheme();
  const imageRef = useRef<any>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const cornerSize = 8;

  // Load image
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImage(img);
      // Set initial dimensions (scaled down if too large)
      const maxWidth = 300;
      const maxHeight = 300;
      const aspectRatio = img.width / img.height;
      
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
      
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
      
      setImageDimensions({ width, height });
    };
    img.src = src;
  }, [src]);

  // Selection border color
  const borderColor = isDarkMode ? "#60a5fa" : "#3b82f6";

  // Handle resize by dragging corner handles
  const handleCornerDrag = (e: any, corner: string) => {
    e.cancelBubble = true; // Prevent group drag

    if (!onResize) return;

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    const scale = stage.scaleX();

    // Get actual position accounting for stage transform
    const stagePos = stage.position();
    const adjustedPointer = {
      x: (pointer.x - stagePos.x) / scale,
      y: (pointer.y - stagePos.y) / scale,
    };

    // Calculate distance from image center to determine new size
    const centerX = x + imageDimensions.width / 2;
    const centerY = y + imageDimensions.height / 2;
    const distance = Math.sqrt(
      Math.pow(adjustedPointer.x - centerX, 2) +
        Math.pow(adjustedPointer.y - centerY, 2)
    );

    // Scale image size based on distance (with min/max limits)
    const scaleFactor = Math.min(Math.max(0.5, distance / 100), 3);
    const originalAspectRatio = image ? image.width / image.height : 1;
    
    const newWidth = Math.min(Math.max(50, 100 * scaleFactor), 500);
    const newHeight = newWidth / originalAspectRatio;

    onResize(id, { width: newWidth, height: newHeight });
    setImageDimensions({ width: newWidth, height: newHeight });
  };

  if (!image) {
    return null; // Don't render until image is loaded
  }

  return (
    <BaseCanvasComponent
      id={id}
      x={x}
      y={y}
      isSelected={isSelected}
      onSelect={onSelect}
      onDragMove={onDragMove}
      width={imageDimensions.width}
      height={imageDimensions.height}
      showSelectionBorder={false} // We'll handle our own selection with resize handles
      showHoverEffect={true}
    >
      {/* Custom selection border with resize handles */}
      {isSelected && (
        <>
          {/* Selection border */}
          <Rect
            x={-8}
            y={-8}
            width={imageDimensions.width + 16}
            height={imageDimensions.height + 16}
            stroke={borderColor}
            strokeWidth={1}
            fill="transparent"
          />

          {/* Corner resize handles */}
          <Rect
            x={-cornerSize}
            y={-cornerSize}
            width={cornerSize}
            height={cornerSize}
            fill={borderColor}
            stroke="white"
            strokeWidth={1}
            draggable
            onDragMove={(e) => handleCornerDrag(e, "top-left")}
          />
          <Rect
            x={imageDimensions.width}
            y={-cornerSize}
            width={cornerSize}
            height={cornerSize}
            fill={borderColor}
            stroke="white"
            strokeWidth={1}
            draggable
            onDragMove={(e) => handleCornerDrag(e, "top-right")}
          />
          <Rect
            x={-cornerSize}
            y={imageDimensions.height}
            width={cornerSize}
            height={cornerSize}
            fill={borderColor}
            stroke="white"
            strokeWidth={1}
            draggable
            onDragMove={(e) => handleCornerDrag(e, "bottom-left")}
          />
          <Rect
            x={imageDimensions.width}
            y={imageDimensions.height}
            width={cornerSize}
            height={cornerSize}
            fill={borderColor}
            stroke="white"
            strokeWidth={1}
            draggable
            onDragMove={(e) => handleCornerDrag(e, "bottom-right")}
          />
        </>
      )}

      {/* The actual image */}
      <KonvaImage
        ref={imageRef}
        image={image}
        width={imageDimensions.width}
        height={imageDimensions.height}
        shadowColor={isDarkMode ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)"}
        shadowBlur={isSelected ? 8 : 4}
        shadowOpacity={0.6}
        shadowOffsetX={1}
        shadowOffsetY={1}
      />
    </BaseCanvasComponent>
  );
};

export default ImageComponent; 