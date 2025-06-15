import React, { useState } from "react";
import { Group, Rect } from "react-konva";
import { useTheme } from "../context/ThemeContext";

export interface BaseCanvasComponentProps {
  id: string;
  x: number;
  y: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragMove: (e: any, id: string) => void;
  children: React.ReactNode;
  width?: number;
  height?: number;
  showSelectionBorder?: boolean;
  showHoverEffect?: boolean;
  onDoubleClick?: () => void;
}

const BaseCanvasComponent = ({
  id,
  x,
  y,
  isSelected,
  onSelect,
  onDragMove,
  children,
  width,
  height,
  showSelectionBorder = true,
  showHoverEffect = true,
  onDoubleClick,
}: BaseCanvasComponentProps) => {
  const { isDarkMode } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Selection border color
  const borderColor = isDarkMode ? "#60a5fa" : "#3b82f6";

  // Handle click
  const handleClick = () => {
    onSelect(id);
  };

  // Handle double click
  const handleDoubleClick = () => {
    if (onDoubleClick) {
      onDoubleClick();
    }
  };

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Handle drag end
  const handleDragEnd = (e: any) => {
    setIsDragging(false);
    onDragMove(e, id);
  };

  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onTap={handleClick}
      onDblClick={handleDoubleClick}
      onDblTap={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection border */}
      {showSelectionBorder && isSelected && width && height && (
        <Rect
          x={-8}
          y={-8}
          width={width + 16}
          height={height + 16}
          stroke={borderColor}
          strokeWidth={1}
          fill="transparent"
        />
      )}

      {/* Hover effect */}
      {showHoverEffect && isHovered && !isSelected && width && height && (
        <Rect
          x={-4}
          y={-4}
          width={width + 8}
          height={height + 8}
          stroke={borderColor}
          strokeWidth={1}
          fill="transparent"
          opacity={0.5}
        />
      )}

      {/* Children components */}
      {children}
    </Group>
  );
};

export default BaseCanvasComponent; 