import React, { useState, useRef, useCallback } from "react";
import { Stage, Layer, Rect, Text, Group, Line } from "react-konva";
import Konva from "konva";
import { JSX } from "react";

const InfiniteCanvas = () => {
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [cardPositions, setCardPositions] = useState({});
  const stageRef = useRef<Konva.Stage>(null);

  // Sample project data
  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      type: "Web App",
      x: 100,
      y: 100,
      color: "#3B82F6",
    },
    {
      id: 2,
      title: "Mobile Banking App",
      type: "Mobile",
      x: 400,
      y: 150,
      color: "#10B981",
    },
    {
      id: 3,
      title: "Dashboard Analytics",
      type: "Dashboard",
      x: 700,
      y: 80,
      color: "#8B5CF6",
    },
    {
      id: 4,
      title: "Social Media Tool",
      type: "Web App",
      x: 200,
      y: 350,
      color: "#EF4444",
    },
    {
      id: 5,
      title: "Fitness Tracker",
      type: "Mobile",
      x: 550,
      y: 400,
      color: "#F97316",
    },
    {
      id: 6,
      title: "Portfolio Website",
      type: "Website",
      x: 800,
      y: 300,
      color: "#EC4899",
    },
    {
      id: 7,
      title: "Video Streaming",
      type: "Web App",
      x: 150,
      y: 600,
      color: "#6366F1",
    },
    {
      id: 8,
      title: "Task Manager",
      type: "Productivity",
      x: 500,
      y: 650,
      color: "#14B8A6",
    },
  ];

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
    const newPos = {
      x: e.target.x(),
      y: e.target.y(),
    };
    setCardPositions((prev) => ({
      ...prev,
      [projectId]: newPos,
    }));
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

    // Vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, startY - 1000, x, endY + 1000]}
          stroke="rgba(99, 12, 12, 0.1)"
          strokeWidth={1}
        />
      );
    }

    // // Horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[startX - 1000, y, endX + 1000, y]}
          stroke="rgba(173, 18, 18, 0.1)"
          strokeWidth={1}
        />
      );
    }

    return lines;
  };

  // Generate connection lines
  const generateConnectionLines = () => {
    return projects.slice(0, -1).map((project, index) => {
      const nextProject = projects[index + 1];
      const pos1 = getCardPosition(project);
      const pos2 = getCardPosition(nextProject);

      return (
        <Line
          key={`connection-${project.id}`}
          points={[pos1.x + 150, pos1.y + 100, pos2.x + 150, pos2.y + 100]}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={2}
          dash={[5, 5]}
        />
      );
    });
  };

  // Project Card Component
  const ProjectCard = ({ project }) => {
    const position = getCardPosition(project);

    return (
      <Group
        key={project.id}
        x={position.x}
        y={position.y}
        draggable
        onDragMove={(e) => handleCardDragMove(e, project.id)}
        onClick={() => handleCardClick(project)}
        onTap={() => handleCardClick(project)}
      >
        {/* Card background */}
        <Rect
          width={300}
          height={200}
          fill={project.color}
          cornerRadius={12}
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.3}
          shadowOffsetX={0}
          shadowOffsetY={4}
        />

        {/* Card title */}
        <Text
          x={20}
          y={20}
          text={project.title}
          fontSize={20}
          fontStyle="bold"
          fill="white"
          width={260}
        />

        {/* Card type badge */}
        <Rect
          x={20}
          y={60}
          width={project.type.length * 8 + 16}
          height={28}
          fill="rgba(255,255,255,0.2)"
          cornerRadius={14}
        />
        <Text x={28} y={68} text={project.type} fontSize={14} fill="white" />

        {/* Instructions */}
        <Text
          x={20}
          y={160}
          text="Drag to move • Click for details"
          fontSize={12}
          fill="rgba(255,255,255,0.8)"
          width={260}
        />
      </Group>
    );
  };

  return (
    <div className="w-full h-screen bg-white relative overflow-hidden p-10">
      {/* Navigation */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button onClick={resetView}>Reset View</button>
        <button onClick={zoomToFit}>Fit All</button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-4 right-4 z-10 px-3 py-2 bg-red-500 backdrop-blur-sm text-white rounded-lg">
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
        onDragEnd={(e) => {
          setStagePos({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        ref={stageRef}
        style={{ backgroundColor: "transparent" }}
      >
        {/* Grid Layer */}
        <Layer>{generateGridLines()}</Layer>

        {/* Connection Lines Layer */}
        <Layer>{generateConnectionLines()}</Layer>

        {/* Project Cards Layer */}
        <Layer>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Layer>
      </Stage>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-green-500 text-sm">
        <p>
          • Drag canvas to pan • Scroll to zoom • Drag cards to move • Click
          cards for details
        </p>
      </div>
    </div>
  );
};

export default InfiniteCanvas;
