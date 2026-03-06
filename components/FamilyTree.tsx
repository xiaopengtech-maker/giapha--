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
  level: number;
  position: number;
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
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [maxLevel, setMaxLevel] = useState(0);

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

  // Build tree structure
  const buildTree = useMemo(() => {
    if (roots.length === 0) return { trees: [], maxLevel: 0 };

    const visited = new Set<string>();
    let maxLvl = 0;

    const buildNode = (personId: string, level: number, position: number): TreeNode | null => {
      if (visited.has(personId)) return null;
      visited.add(personId);

      const data = getTreeData(personId);
      if (!data.person) return null;

      maxLvl = Math.max(maxLvl, level);

      const spouses = hideSpouses ? [] : data.spouses.map(s => s.person);

      const children: TreeNode[] = [];
      data.children.forEach((child, idx) => {
        const childNode = buildNode(child.id, level + 1, idx);
        if (childNode) children.push(childNode);
      });

      return {
        person: data.person,
        spouses,
        children,
        level,
        position,
      };
    };

    const trees: TreeNode[] = [];
    roots.forEach((root, idx) => {
      const tree = buildNode(root.id, 0, idx);
      if (tree) trees.push(tree);
    });

    return { trees, maxLevel: maxLvl };
  }, [roots, personsMap, relationships, hideSpouses, hideMales, hideFemales, adj]);

  useEffect(() => {
    setTreeData(buildTree.trees);
    setMaxLevel(buildTree.maxLevel);
  }, [buildTree]);

  // Render a single node and its children in vertical layout
  const renderVerticalNode = (node: TreeNode, isLast: boolean): React.ReactNode => {
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.person.id} className="relative">
        {/* Connection line from parent */}
        {node.level > 0 && (
          <>
            <div
              className="absolute border-l-2 border-stone-300"
              style={{
                left: "50%",
                top: isLast ? "-20px" : "-20px",
                bottom: isLast ? "auto" : "-20px",
                height: isLast ? "44px" : "100%",
                transform: "translateX(-50%)",
              }}
            />
            <div
              className="absolute border-b-2 border-stone-300 rounded-bl-xl"
              style={{
                left: "50%",
                top: "24px",
                width: "50%",
                height: "20px",
                transform: "translateX(-50%)",
              }}
            />
          </>
        )}

        {/* Main person */}
        <div className="flex flex-col items-center">
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

        {/* Children - vertical layout */}
        {hasChildren && (
          <div className="mt-2 relative">
            {/* Horizontal line connecting children */}
            {node.children.length > 1 && (
              <div
                className="absolute border-t-2 border-stone-300"
                style={{
                  left: `${100 / node.children.length / 2}%`,
                  right: `${100 / node.children.length / 2}%`,
                  top: "-2px",
                }}
              />
            )}
            
            <div className="flex justify-center gap-2 flex-wrap">
              {node.children.map((child, idx) => (
                <div key={child.person.id} className="flex flex-col items-center">
                  {/* Vertical line from parent to child */}
                  <div
                    className="w-px bg-stone-300"
                    style={{ height: "8px" }}
                  />
                  {renderVerticalNode(child, idx === node.children.length - 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (roots.length === 0) {
    return (
      <div className="text-center p-10 text-stone-500">
        Không tìm thấy dữ liệu.
      </div>
    );
  }

  // Calculate dimensions for the vertical tree
  const nodeHeight = 100; // Height per node including spacing
  const treeHeight = (maxLevel + 1) * nodeHeight + 100;

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
          className={`relative mx-auto p-8 transition-all duration-200 ${isDragging ? "opacity-90" : ""}`}
          style={{
            minHeight: treeHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {/* Render each root tree */}
          <div className="flex justify-center gap-8 flex-wrap">
            {treeData.map((tree, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {renderVerticalNode(tree, true)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
