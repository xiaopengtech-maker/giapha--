"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import { usePanZoom } from "@/hooks/usePanZoom";
import { Person, Relationship } from "@/types";
import { useDashboard } from "./DashboardContext";
import FamilyNodeCard from "./FamilyNodeCard";
import TreeToolbar from "./TreeToolbar";

import { buildAdjacencyLists, getFilteredTreeData } from "@/utils/treeHelpers";

interface TreeNode {
  person: Person;
  spouses: Person[];
  children: TreeNode[];
  x: number;
  y: number;
  level: number;
}

export default function FamilyTree({
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
  const [treeNodes, setTreeNodes] = useState<Map<string, TreeNode>>(new Map());
  const [treeWidth, setTreeWidth] = useState(0);
  const [treeHeight, setTreeHeight] = useState(0);

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

  // Constants for layout
  const NODE_WIDTH = 80;
  const NODE_HEIGHT = 70;
  const LEVEL_HEIGHT = 90; // Vertical distance between levels
  const MIN_SIBLING_SPACING = 10;
  const SIBLING_SPACING_MULTIPLIER = 1.2;

  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    }
  }, [roots]);

  const adj = useMemo(
    () => buildAdjacencyLists(relationships, personsMap),
    [relationships, personsMap],
  );

  const getTreeData = (personId: string) =>
    getFilteredTreeData(personId, personsMap, adj, {
      hideSpouses,
      hideMales,
      hideFemales,
    });

  // Build tree structure and calculate positions
  const calculateTreeLayout = useMemo(() => {
    if (roots.length === 0) return { nodes: new Map<string, TreeNode>(), width: 0, height: 0 };

    const nodes = new Map<string, TreeNode>();
    let maxX = 0;
    let maxY = 0;

    // Calculate subtree width
    const calculateSubtreeWidth = (personId: string, visited: Set<string>): number => {
      if (visited.has(personId)) return 0;
      visited.add(personId);

      const data = getTreeData(personId);
      if (!data.person) return 0;

      const childrenWidths = data.children.map(child => 
        calculateSubtreeWidth(child.id, new Set(visited))
      );

      const totalChildrenWidth = childrenWidths.reduce((a, b) => a + b, 0);
      
      // If has children, return their total width; otherwise return node width
      if (data.children.length > 0) {
        return Math.max(NODE_WIDTH, totalChildrenWidth);
      }
      return NODE_WIDTH;
    };

    // Position nodes in the tree
    const positionNode = (
      personId: string, 
      level: number, 
      startX: number,
      visited: Set<string>
    ): number => {
      if (visited.has(personId)) return startX;
      visited.add(personId);

      const data = getTreeData(personId);
      if (!data.person) return startX;

      // Calculate width needed for this subtree
      const subtreeWidth = calculateSubtreeWidth(personId, new Set(visited));
      
      // Position this node at the center of its subtree
      const x = startX + subtreeWidth / 2 - NODE_WIDTH / 2;
      const y = level * LEVEL_HEIGHT;

      // Get spouses
      const spouses = hideSpouses ? [] : data.spouses.map(s => s.person);

      // Store node
      nodes.set(personId, {
        person: data.person,
        spouses,
        children: [],
        x,
        y,
        level,
      });

      maxX = Math.max(maxX, x + NODE_WIDTH);
      maxY = Math.max(maxY, y + NODE_HEIGHT);

      // Position children
      let currentX = startX;
      data.children.forEach(child => {
        const childWidth = calculateSubtreeWidth(child.id, new Set(visited));
        positionNode(child.id, level + 1, currentX, visited);
        currentX += childWidth;
      });

      // Update children references
      const node = nodes.get(personId)!;
      node.children = data.children
        .map(child => nodes.get(child.id))
        .filter((n): n is TreeNode => n !== undefined);

      return startX + subtreeWidth;
    };

    // Process each root
    let currentX = 50;
    roots.forEach(root => {
      const rootWidth = calculateSubtreeWidth(root.id, new Set<string>());
      positionNode(root.id, 0, currentX, new Set<string>());
      currentX += rootWidth + 50; // Add gap between different root trees
    });

    return { 
      nodes, 
      width: maxX + 100, 
      height: maxY + 150 
    };
  }, [roots, personsMap, relationships, hideSpouses, hideMales, hideFemales, adj]);

  // Update state when layout changes
  useEffect(() => {
    setTreeNodes(calculateTreeLayout.nodes);
    setTreeWidth(calculateTreeLayout.width);
    setTreeHeight(calculateTreeLayout.height);
  }, [calculateTreeLayout]);

  const renderConnections = () => {
    const paths: React.ReactNode[] = [];
    
    treeNodes.forEach((node, personId) => {
      node.children.forEach(child => {
        // Draw line from parent to child
        const startX = node.x + NODE_WIDTH / 2;
        const startY = node.y + NODE_HEIGHT;
        const endX = child.x + NODE_WIDTH / 2;
        const endY = child.y;
        
        // Draw vertical line down from parent
        const midY = startY + (endY - startY) / 2;
        
        const pathData = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;

        paths.push(
          <path
            key={`${personId}-${child.person.id}`}
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
            width: treeWidth,
            height: treeHeight,
            minWidth: treeWidth,
            minHeight: treeHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {/* SVG Layer for connections */}
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: treeWidth,
              height: treeHeight,
            }}
          >
            {renderConnections()}
          </svg>

          {/* Nodes Layer */}
          <div className="absolute top-0 left-0" style={{ width: treeWidth, height: treeHeight }}>
            {Array.from(treeNodes.values()).map((node) => (
              <div
                key={node.person.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: node.x + NODE_WIDTH / 2,
                  top: node.y + NODE_HEIGHT / 2,
                }}
              >
                <div className="flex flex-col items-center">
                  {/* Main person */}
                  <FamilyNodeCard
                    person={node.person}
                    level={node.level}
                    isCompact
                  />

                  {/* Spouses */}
                  {node.spouses.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {node.spouses.map((spouse, idx) => (
                        <FamilyNodeCard
                          key={spouse.id}
                          person={spouse}
                          role={spouse.gender === "male" ? "Chồng" : "Vợ"}
                          level={node.level}
                          isCompact
                          isPlusVisible={idx > 0}
                          isRingVisible={idx === 0}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
