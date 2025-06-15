import React, { useState, useRef, useEffect } from "react";
import { Text, Rect } from "react-konva";
import { useTheme } from "../context/ThemeContext";
import BaseCanvasComponent, {
  BaseCanvasComponentProps,
} from "./BaseCanvasComponent";

interface TextComponentProps
  extends Omit<BaseCanvasComponentProps, "children" | "width" | "height"> {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  fill?: string | null;
  onResize: (id: number, newFontSize: number) => void;
  onTextChange?: (id: number, newText: string) => void;
}

const TextComponent = ({
  id,
  text,
  x,
  y,
  fontSize = 24,
  fontFamily = "Jockey One",
  fontStyle = "normal",
  fill,
  isSelected,
  onSelect,
  onDragMove,
  onResize,
  onTextChange,
}: TextComponentProps) => {
  const { isDarkMode } = useTheme();
  const textRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [textDimensions, setTextDimensions] = useState({ width: 0, height: 0 });
  const cornerSize = 8;

  // Measure actual text dimensions
  useEffect(() => {
    if (textRef.current) {
      const textNode = textRef.current;
      setTextDimensions({
        width: textNode.width(),
        height: textNode.height(),
      });
    }
  }, [text, fontSize, fontFamily, fontStyle]);

  // Default fill color based on theme if not provided
  const textFill = fill || (isDarkMode ? "#ffffff" : "#000000");

  // Selection border color
  const borderColor = isDarkMode ? "#60a5fa" : "#3b82f6";

  // Handle double click to edit
  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(text);
  };

  // Handle resize by dragging corner handles
  const handleCornerDrag = (e: any, corner: string) => {
    e.cancelBubble = true; // Prevent group drag

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    const scale = stage.scaleX();

    // Get actual position accounting for stage transform
    const stagePos = stage.position();
    const adjustedPointer = {
      x: (pointer.x - stagePos.x) / scale,
      y: (pointer.y - stagePos.y) / scale,
    };

    // Calculate distance from text center to determine new font size
    const centerX = x + textDimensions.width / 2;
    const centerY = y + textDimensions.height / 2;
    const distance = Math.sqrt(
      Math.pow(adjustedPointer.x - centerX, 2) +
        Math.pow(adjustedPointer.y - centerY, 2)
    );

    // Scale font size based on distance (with min/max limits)
    const newFontSize = Math.min(Math.max(12, distance / 4), 120);
    onResize(Number(id), newFontSize);
  };

  return (
    <>
      <BaseCanvasComponent
        id={id}
        x={x}
        y={y}
        isSelected={isSelected}
        onSelect={onSelect}
        onDragMove={onDragMove}
        width={textDimensions.width}
        height={textDimensions.height}
        showSelectionBorder={false} // We'll handle our own selection with resize handles
        showHoverEffect={true}
        onDoubleClick={handleDoubleClick}
      >
        {/* Custom selection border with resize handles */}
        {isSelected && (
          <>
            {/* Selection border */}
            <Rect
              x={-8}
              y={-8}
              width={textDimensions.width + 16}
              height={textDimensions.height + 16}
              stroke={borderColor}
              strokeWidth={1}
              fill="transparent"
            />

            {/* Corner resize handles - Fixed positioning */}
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
              x={textDimensions.width}
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
              y={textDimensions.height}
              width={cornerSize}
              height={cornerSize}
              fill={borderColor}
              stroke="white"
              strokeWidth={1}
              draggable
              onDragMove={(e) => handleCornerDrag(e, "bottom-left")}
            />
            <Rect
              x={textDimensions.width}
              y={textDimensions.height}
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

        {/* The actual text */}
        <Text
          ref={textRef}
          text={text}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fontStyle={fontStyle}
          fill={textFill}
          shadowColor={isDarkMode ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)"}
          shadowBlur={isSelected ? 8 : 4}
          shadowOpacity={0.6}
          shadowOffsetX={1}
          shadowOffsetY={1}
        />
      </BaseCanvasComponent>

      {/* Text editing input - positioned absolutely */}
      {isEditing && (
        <input
          type="text"
          value={editText}
          style={{
            position: "absolute",
            left: x,
            top: y,
            fontSize: fontSize,
            fontFamily: fontFamily,
            fontWeight: fontStyle.includes("bold") ? "bold" : "normal",
            fontStyle: fontStyle.includes("italic") ? "italic" : "normal",
            color: textFill,
            background: "transparent",
            border: "2px solid " + borderColor,
            outline: "none",
            zIndex: 1000,
          }}
          autoFocus
        />
      )}
    </>
  );
};

export default TextComponent;
