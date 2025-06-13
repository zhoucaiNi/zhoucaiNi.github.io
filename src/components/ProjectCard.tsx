import React from "react";
import { Group, Rect, Text } from "react-konva";
import { useTheme } from "../context/ThemeContext";

type ProjectCardProps = {
  project: {
    id: number;
    title: string;
    type: string;
    color: string;
  };
  handleCardDragMove: (e: any, projectId: number) => void;
  getCardPosition: (project: any) => { x: number; y: number };
  isSelected: boolean;
};

// Project Card Component
const ProjectCard = ({
  project,
  handleCardDragMove,
  getCardPosition,
  isSelected,
}: ProjectCardProps) => {
  const position = getCardPosition(project);
  const { isDarkMode } = useTheme();

  return (
    <Group
      key={project.id}
      x={position.x}
      y={position.y}
      draggable
      onDragMove={(e) => handleCardDragMove(e, project.id)}
    >
      {/* Card background */}
      <Rect
        width={300}
        height={200}
        fill={project.color}
        cornerRadius={12}
        shadowColor={isDarkMode ? "white" : "black"}
        shadowBlur={10}
        shadowOpacity={isDarkMode ? 0.2 : 0.3}
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
        fill={isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)"}
        cornerRadius={14}
      />
      <Text x={28} y={68} text={project.type} fontSize={14} fill="white" />

      {/* Instructions */}
      <Text
        x={20}
        y={160}
        text="Drag to move • Click for details"
        fontSize={12}
        fill={isDarkMode ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.8)"}
        width={260}
      />
    </Group>
  );
};

export default ProjectCard;
