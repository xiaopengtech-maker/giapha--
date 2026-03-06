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

export default function FamilyTree ({
  personsMap,
  relationships,
  roots,
  canEdit,
  layout = "vertical",
}: {
  personsMap: Map<string, Person>;
  relationships: Relationship[];
  roots: Person[];
  canEdit?: boolean;
  layout?: "vertical" | "horizontal" | "circular" | "pentagonal" | "hexagonal";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hideSpouses, setHideSpouses] = useState(false);
  const [hideMales, setHideMales] = useState(false);
  const [hideFemales, setHideFemales] = useState(false);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [maxLevel, setMaxLevel] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

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

  // Build tree structure - sorted by birth year
  const buildTree = useMemo(() => {
    if (roots.length === 0) return { trees: [], maxLevel: 0 };

    let maxLvl = 0;

    const buildNode = (personId: string, level: number, position: number): TreeNode | null => {
      const data = getTreeData(personId);
      if (!data.person) return null;

      maxLvl = Math.max(maxLvl, level);

      const spouses = hideSpouses ? [] : data.spouses.map(s => s.person);

      // Sort children by birth year (oldest first)
      const sortedChildren = [...data.children].sort((a, b) => {
        const aYear = a.birth_year || 9999;
        const bYear = b.birth_year || 9999;
        return aYear - bYear;
      });

      const children: TreeNode[] = [];
      sortedChildren.forEach((child, idx) => {
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

  // Render a family unit with rectangular box - compact version
  const renderFamilyUnit = (node: TreeNode): React.ReactNode => {
    const hasChildren = node.children.length > 0;
    const hasSpouses = node.spouses.length > 0;

    return (
      <div key={node.person.id} className="flex flex-col items-center">
        {/* Main parent box - compact */}
        <div className={`
          relative bg-white rounded-lg border shadow-sm p-1
          ${node.level === 0 ? 'border-amber-400' : 'border-stone-300'}
        `}>
          <div className="flex flex-col items-center">
            {/* Main person */}
            <FamilyNodeCard
              person={node.person}
              level={node.level}
              isCompact
            />

            {/* Spouses - compact */}
            {hasSpouses && (
              <div className="flex gap-0.5 mt-0.5">
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

        {/* Children container - compact */}
        {hasChildren && (
          <div className="mt-1">
            {/* Vertical line */}
            <div className="w-px h-1 bg-stone-400" />
            
            {/* Children box */}
            <div className="bg-stone-50 rounded border border-dashed border-stone-300 p-2 min-w-[150px]">
              {/* Generation label - smaller */}
              <div className="text-center text-[10px] text-stone-500 font-medium mb-1">
                Thế hệ {node.level + 1}
              </div>
              
              {/* Children - compact grid */}
              <div className="flex flex-wrap justify-center gap-1">
                {node.children.map((child, idx) => (
                  <div key={child.person.id} className="flex flex-col items-center">
                    <div className="w-px h-1 bg-stone-300" />
                    
                    {/* Child box - compact */}
                    <div className="bg-white rounded border border-stone-200 p-1">
                      <div className="flex flex-col items-center">
                        <FamilyNodeCard
                          person={child.person}
                          level={child.level}
                          isCompact
                        />
                        
                        {/* Child's spouse - compact */}
                        {child.spouses.length > 0 && (
                          <div className="flex gap-0.5 mt-0.5">
                            {child.spouses.map((spouse, sIdx) => (
                              <FamilyNodeCard
                                key={spouse.id}
                                person={spouse}
                                role={spouse.gender === "male" ? "Chồng" : "Vợ"}
                                level={child.level}
                                isCompact
                                isPlusVisible={sIdx > 0}
                                isRingVisible={sIdx === 0}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Grandchildren - compact */}
                      {child.children.length > 0 && (
                        <div className="mt-0.5 pt-0.5 border-t border-stone-100">
                          {renderFamilyUnit(child)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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

  const nodeHeight = 120;
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

      {/* Preview Button */}
      <div className="absolute top-16 right-4 z-20">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-md text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Xem trước ảnh
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-stone-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-stone-800">Xem trước gia phả</h3>
              <button onClick={() => setShowPreview(false)} className="text-stone-500 hover:text-stone-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mx-auto bg-white" style={{width: '1041px', height: '704px', overflow: 'hidden'}}>
                <div className="flex flex-col items-center justify-start min-h-[704px] p-4 bg-gradient-to-b from-stone-50 to-stone-100">
                  <h1 className="text-2xl font-bold text-stone-800 mb-6">Gia phả</h1>
                  <div className="flex justify-center gap-8 flex-wrap">
                    {treeData.map((tree, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        {renderFamilyUnit(tree)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-stone-500">
                Kích thước: 1041 x 704 pixels
              </div>
            </div>
          </div>
        </div>
      )}

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
          <div className="flex justify-center gap-8 flex-wrap">
            {treeData.map((tree, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {renderFamilyUnit(tree)}
              </div>
            ))}
          </div>
        </div>
      </div>    </div>
  );
}
