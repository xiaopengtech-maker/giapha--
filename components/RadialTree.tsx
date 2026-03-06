"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePanZoom } from "@/hooks/usePanZoom";
import { Person, Relationship } from "@/types";
import { useDashboard } from "./DashboardContext";
import FamilyNodeCard from "./FamilyNodeCard";
import TreeToolbar from "./TreeToolbar";
import { buildAdjacencyLists, getFilteredTreeData } from "@/utils/treeHelpers";

interface RadialNodeData {
  person: Person;
  angle: number;
  radius: number;
  level: number;
  spouses: Person[];
  children: Person[];
}

export default function RadialTree({
  personsMap,
  relationships,
  roots,
  canEdit,
}: {
  personsMap: Map<string, Person>;
  relationships: Relationship[];
  roots: Person[];
  canEdit?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hideSpouses, setHideSpouses] = useState(false);
  const [hideMales, setHideMales] = useState(false);
  const [hideFemales, setHideFemales] = useState(false);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number }>>(new Map());

  const { showAvatar } = useDashboard();

  const {
    scale,
    isPressed,
    isDragging,
    handlers: {
      handleMouseDown,
      handleMouseMove,
      handleMouseUpOrLeave,
      handleClickCapture,
      handleZoomIn,
      handleZoomOut,
      handleResetZoom,
    },
  } = usePanZoom(containerRef);

  const adj = useMemo(
    () => buildAdjacencyLists(relationships, personsMap),
    [relationships, personsMap]
  );

  // Calculate radial layout
  const radialData = useMemo(() => {
    const data = new Map<string, RadialNodeData>();
    const visited = new Set<string>();
    
    const calculateLayout = (personId: string, level: number, startAngle: number, endAngle: number) => {
      if (visited.has(personId) || collapsedNodes.has(personId)) return 0;
      visited.add(personId);

      const treeData = getFilteredTreeData(personId, personsMap, adj, {
        hideSpouses,
        hideMales,
        hideFemales,
      });

      if (!treeData.person) return 0;

      // Calculate available angle for this node and its descendants
      const angleRange = endAngle - startAngle;
      const angle = startAngle + angleRange / 2;
      
      // Radius increases with level
      const baseRadius = 120;
      const radius = level * baseRadius;

      // Get children
      const children = treeData.children;
      const totalWeight = children.length || 1;
      
      let currentAngle = startAngle;
      const childAngles: { id: string; angle: number }[] = [];

      children.forEach((child, index) => {
        const childWeight = 1;
        const childAngleRange = (angleRange * childWeight) / totalWeight;
        const childAngle = currentAngle + childAngleRange / 2;
        
        childAngles.push({ id: child.id, angle: childAngle });
        
        // Recursively calculate child layout
        calculateLayout(child.id, level + 1, currentAngle, currentAngle + childAngleRange);
        
        currentAngle += childAngleRange;
      });

      // Get spouses (filtered)
      const spouses = hideSpouses ? [] : treeData.spouses.map(s => s.person);

      data.set(personId, {
        person: treeData.person,
        angle,
        radius,
        level,
        spouses,
        children,
      });

      return children.length;
    };

    // Start from each root with equal angle distribution
    const totalRoots = roots.length;
    const anglePerRoot = (2 * Math.PI) / totalRoots;

    roots.forEach((root, index) => {
      const startAngle = index * anglePerRoot - Math.PI / 2; // Start from top
      const endAngle = startAngle + anglePerRoot;
      calculateLayout(root.id, 0, startAngle, endAngle);
    });

    return data;
  }, [roots, personsMap, adj, hideSpouses, hideMales, hideFemales, collapsedNodes]);

  // Calculate positions
  useEffect(() => {
    const positions = new Map<string, { x: number; y: number }>();
    
    radialData.forEach((node, id) => {
      const x = Math.cos(node.angle) * node.radius;
      const y = Math.sin(node.angle) * node.radius;
      positions.set(id, { x, y });
    });

    setNodePositions(positions);
  }, [radialData]);

  const toggleCollapse = (personId: string) => {
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(personId)) {
        newSet.delete(personId);
      } else {
        newSet.add(personId);
      }
      return newSet;
    });
  };

  const renderRadialNode = (personId: string): React.ReactNode => {
    const nodeData = radialData.get(personId);
    const position = nodePositions.get(personId);
    
    if (!nodeData || !position) return null;

    const hasChildren = nodeData.children.length > 0;
    const isCollapsed = collapsedNodes.has(personId);

    return (
      <div
        key={personId}
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `calc(50% + ${position.x}px)`,
          top: `calc(50% + ${position.y}px)`,
        }}
      >
        <div className="flex flex-col items-center">
          {/* Main person */}
          <div className="relative">
            <FamilyNodeCard
              person={nodeData.person}
              level={nodeData.level}
              isCompact
              isExpandable={hasChildren}
              isExpanded={!isCollapsed}
              onClickCard={() => hasChildren && toggleCollapse(personId)}
            />
          </div>

          {/* Spouses - arranged horizontally */}
          {nodeData.spouses.length > 0 && (
            <div className="flex gap-1 mt-1">
              {nodeData.spouses.map((spouse, idx) => (
                <FamilyNodeCard
                  key={spouse.id}
                  person={spouse}
                  role={spouse.gender === "male" ? "Chồng" : "Vợ"}
                  level={nodeData.level}
                  isCompact
                  isPlusVisible={idx > 0}
                  isRingVisible={idx === 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Calculate SVG paths for connections
  const renderConnections = () => {
    const paths: React.ReactNode[] = [];
    
    radialData.forEach((node, personId) => {
      const parentPos = nodePositions.get(personId);
      if (!parentPos) return;

      node.children.forEach((child) => {
        const childPos = nodePositions.get(child.id);
        if (!childPos) return;

        // Create curved path from parent to child
        const startX = parentPos.x;
        const startY = parentPos.y;
        const endX = childPos.x;
        const endY = childPos.y;

        // Control point for bezier curve (curved outward)
        const midRadius = (node.radius + (radialData.get(child.id)?.radius || 0)) / 2;
        const midAngle = (node.angle + (radialData.get(child.id)?.angle || 0)) / 2;
        const cpX = Math.cos(midAngle) * midRadius;
        const cpY = Math.sin(midAngle) * midRadius;

        const pathData = `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;

        paths.push(
          <path
            key={`${personId}-${child.id}`}
            d={pathData}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            className="transition-all duration-300"
          />
        );
      });
    });

    return paths;
  };

  if (roots.length === 0) {
    return (
      <div className="text-center p-10 text-stone-500">
        Không tìm thấy dữ liệu.
      </div>
    );
  }

  // Calculate container size based on max radius
  const maxRadius = Math.max(...Array.from(radialData.values()).map(n => n.radius), 300);
  const containerSize = (maxRadius + 150) * 2;

  return (
    <div className="w-full h-full relative">
      <TreeToolbar
        scale={scale}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleResetZoom={handleResetZoom}
        hideSpouses={hideSpouses}
        setHideSpouses={setHideSpouses}
        hideMales={hideMales}
        setHideMales={setHideMales}
        hideFemales={hideFemales}
        setHideFemales={setHideFemales}
        canEdit={canEdit}
      />

      <div
        ref={containerRef}
        className={`w-full h-full overflow-auto bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 ${isPressed ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClickCapture={handleClickCapture}
        onDragStart={(e) => e.preventDefault()}
      >
        <div
          id="export-container"
          className={`relative mx-auto transition-all duration-200 ${isDragging ? "opacity-90" : ""}`}
          style={{
            width: containerSize,
            height: containerSize,
            minWidth: containerSize,
            minHeight: containerSize,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {/* SVG Layer for connections */}
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: containerSize,
              height: containerSize,
            }}
          >
            <g transform={`translate(${containerSize / 2}, ${containerSize / 2})`}>
              {renderConnections()}
            </g>
          </svg>

          {/* Nodes Layer */}
          <div
            className="absolute top-0 left-0"
            style={{
              width: containerSize,
              height: containerSize,
            }}
          >
            <div
              className="relative w-full h-full"
              style={{
                transform: `translate(${containerSize / 2}px, ${containerSize / 2}px)`,
              }}
            >
              {/* Render all nodes in radialData */}
              {Array.from(radialData.keys()).map((personId) => renderRadialNode(personId))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
