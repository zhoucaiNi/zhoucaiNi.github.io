import React, { useState, useRef, useCallback, useEffect } from "react";
import { Stage, Layer, Rect, Text, Group, Line } from "react-konva";
import Konva from "konva";
import { useTheme } from "../context/ThemeContext";

import { JSX } from "react";
import ProjectCard from "./ProjectCard";
import TextComponent from "./TextComponent";
import {
  projects,
  initialTextElements,
  TextElement,
} from "../utility/Constants";

const InfiniteCanvas = () => {
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [cardPositions, setCardPositions] = useState({});

  const [textElements, setTextElements] =
    useState<TextElement[]>(initialTextElements);

  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Helper function to get card position
  const getCardPosition = (project) => {
    return cardPositions[project.id] || { x: project.x, y: project.y };
  };

  // Handle wheel zoom
  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();

    const scaleBy = 1.02;

    const stage = e.target.getStage();

    const oldScale = stage.scaleX();

    const pointer = stage.getPointerPosition();

    // Get the mouse position relative to the stage
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // Calculate the new scale where scroll up is zoom in and scroll down is zoom out
    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    // Clamp the scale between 0.1 and 3
    newScale = Math.min(Math.max(0.1, newScale), 3);

    setStageScale(newScale);

    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  }, []);

  // Handle card drag
  const handleCardDragMove = useCallback((e, projectId) => {
    console.log(e);
  }, []);

  // Handle card selection
  const handleCardSelect = useCallback((cardId: string) => {
    setSelectedCardId(cardId);
    setSelectedTextId(null); // Deselect text when selecting card
  }, []);

  // Handle text selection
  const handleTextSelect = useCallback((textId: string) => {
    setSelectedTextId(textId);
    setSelectedCardId(null); // Deselect card when selecting text
  }, []);

  // Handle text drag
  const handleTextDragMove = useCallback((e: any, textId: string) => {
    console.log(e);
  }, []);

  // Handle text resize
  const handleTextResize = useCallback(
    (textId: number, newFontSize: number) => {
      setTextElements((prev) =>
        prev.map((text) =>
          text.id === textId ? { ...text, fontSize: newFontSize } : text
        )
      );
    },
    []
  );

  // Handle text content change
  const handleTextChange = useCallback((textId: number, newText: string) => {
    setTextElements((prev) =>
      prev.map((text) =>
        text.id === textId ? { ...text, text: newText } : text
      )
    );
  }, []);

  // Handle stage click to deselect all
  const handleStageClick = useCallback((e) => {
    // Check if clicked on empty area
    if (e.target === e.target.getStage()) {
      setSelectedTextId(null);
      setSelectedCardId(null);
    }
  }, []);

  // Handle card click
  const handleCardClick = useCallback((project) => {
    alert(`Clicked on ${project.title}`);
  }, []);

  // Reset view
  const resetView = () => {
    setStageScale(1);
    setStagePos({ x: 0, y: 0 });
  };

  // Fit all projects in view
  const zoomToFit = () => {
    const allPositions = projects.map(getCardPosition);
    const bounds = allPositions.reduce(
      (acc, pos) => ({
        minX: Math.min(acc.minX, pos.x),
        maxX: Math.max(acc.maxX, pos.x + 300),
        minY: Math.min(acc.minY, pos.y),
        maxY: Math.max(acc.maxY, pos.y + 200),
      }),
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    );

    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    const scaleX = (containerWidth * 0.8) / width;
    const scaleY = (containerHeight * 0.8) / height;
    const scale = Math.min(scaleX, scaleY, 1);

    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;

    setStageScale(scale);
    setStagePos({
      x: containerWidth / 2 - centerX * scale,
      y: containerHeight / 2 - centerY * scale,
    });
  };

  // Generate grid lines
  const generateGridLines = () => {
    const lines: JSX.Element[] = [];
    const gridSize = 50;
    const stageWidth = window.innerWidth;
    const stageHeight = window.innerHeight;

    // Calculate visible area considering current pan and zoom
    const startX = Math.floor(-stagePos.x / stageScale / gridSize) * gridSize;
    const endX =
      Math.ceil((-stagePos.x + stageWidth) / stageScale / gridSize) * gridSize;
    const startY = Math.floor(-stagePos.y / stageScale / gridSize) * gridSize;
    const endY =
      Math.ceil((-stagePos.y + stageHeight) / stageScale / gridSize) * gridSize;

    const gridColor = isDarkMode
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(99, 12, 12, 0.1)";

    // Vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, startY - 1000, x, endY + 1000]}
          stroke={gridColor}
          strokeWidth={1}
        />
      );
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[startX - 1000, y, endX + 1000, y]}
          stroke={gridColor}
          strokeWidth={1}
        />
      );
    }

    return lines;
  };

  return (
    <div
      className={`w-full h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } relative overflow-hidden p-10 transition-colors duration-200`}
    >
      {/* Navigation */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={resetView}
          className={`px-3 py-1 rounded-lg ${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Reset View
        </button>
        <button
          onClick={zoomToFit}
          className={`px-3 py-1 rounded-lg ${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Fit All
        </button>
        <button
          onClick={toggleDarkMode}
          className={`px-3 py-1 rounded-lg ${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>
      </div>

      {/* Zoom indicator */}
      <div
        className={`absolute top-4 right-4 z-10 px-3 py-2 ${
          isDarkMode ? "bg-red-600" : "bg-red-500"
        } backdrop-blur-sm text-white rounded-lg`}
      >
        {Math.round(stageScale * 100)}%
      </div>

      {/* Konva Stage */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={handleWheel}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        draggable
        ref={stageRef}
        onClick={handleStageClick}
        onTap={handleStageClick}
        style={{ backgroundColor: "transparent" }}
      >
        {/* Grid Layer */}
        <Layer>{generateGridLines()}</Layer>

        {/* Project Cards Layer */}
        <Layer>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id.toString()}
              x={project.x}
              y={project.y}
              onDragMove={handleCardDragMove}
              children={null}
              project={project}
              handleCardDragMove={handleCardDragMove}
              getCardPosition={getCardPosition}
              isSelected={selectedCardId === project.id.toString()}
              onSelect={handleCardSelect}
            />
          ))}
        </Layer>

        {/* Text Elements Layer */}
        <Layer>
          {textElements.map((textElement) => (
            <TextComponent
              key={textElement.id}
              id={textElement.id.toString()}
              text={textElement.text}
              x={textElement.x}
              y={textElement.y}
              fontSize={textElement.fontSize}
              fontFamily={textElement.fontFamily}
              fontStyle={textElement.fontStyle}
              fill={textElement.fill}
              isSelected={selectedTextId === textElement.id.toString()}
              onSelect={handleTextSelect}
              onDragMove={handleTextDragMove}
              onResize={handleTextResize}
              onTextChange={handleTextChange}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default InfiniteCanvas;
