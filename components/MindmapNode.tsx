"use client";

import { Person, Relationship } from "@/types";
import { formatDisplayDate } from "@/utils/dateHelpers";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { memo, useState } from "react";
import DefaultAvatar from "./DefaultAvatar";

import { AdjacencyLists, getFilteredTreeData } from "@/utils/treeHelpers";

export interface MindmapContextData {
  personsMap: Map<string, Person>;
  relationships: Relationship[];
  adj: AdjacencyLists;
  hideSpouses: boolean;
  hideMales: boolean;
  hideFemales: boolean;
  showAvatar: boolean;
  expandSignal: { type: "expand" | "collapse"; ts: number } | null;
  setMemberModalId: (id: string | null) => void;
}

export const getTreeData = (personId: string, ctx: MindmapContextData) => {
  return getFilteredTreeData(personId, ctx.personsMap, ctx.adj, {
    hideSpouses: ctx.hideSpouses,
    hideMales: ctx.hideMales,
    hideFemales: ctx.hideFemales,
  });
};

const cardVariants: Variants = {
  hidden: { opacity: 0, x: -20, scale: 0.9 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25
    }
  },
  hover: { 
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  }
};

export const MindmapNode = memo(
  ({
    personId,
    level = 0,
    isLast = false,
    ctx,
  }: {
    personId: string;
    level?: number;
    isLast?: boolean;
    ctx: MindmapContextData;
  }) => {
    const data = getTreeData(personId, ctx);
    const [isExpanded, setIsExpanded] = useState(level < 2);
    const [lastSignalTs, setLastSignalTs] = useState(0);

    if (ctx.expandSignal && ctx.expandSignal.ts !== lastSignalTs) {
      setIsExpanded(ctx.expandSignal.type === "expand");
      setLastSignalTs(ctx.expandSignal.ts);
    }

    if (!data.person) return null;

    const hasChildren = data.children.length > 0;

    const getGradient = () => {
      if (data.person.gender === "male") {
        return "from-blue-400 via-blue-500 to-indigo-600";
      } else if (data.person.gender === "female") {
        return "from-rose-400 via-pink-500 to-fuchsia-500";
      }
      return "from-stone-400 via-stone-500 to-zinc-600";
    };

    const getRingColor = () => {
      if (data.person.gender === "male") {
        return "ring-blue-200";
      } else if (data.person.gender === "female") {
        return "ring-rose-200";
      }
      return "ring-stone-200";
    };

    const getAccentColor = () => {
      if (data.person.gender === "male") {
        return "text-blue-600";
      } else if (data.person.gender === "female") {
        return "text-rose-600";
      }
      return "text-stone-600";
    };

    return (
      <div className={`relative py-1.5 ${level > 0 ? "pl-6" : "pl-0"}`}>
        {level > 0 && (
          <>
            <div
              className="absolute border-l-2 border-stone-300"
              style={{
                left: "0",
                top: isLast ? "-16px" : "-16px",
                bottom: isLast ? "auto" : "-16px",
                height: isLast ? "40px" : "100%",
              }}
            ></div>
            <div
              className="absolute border-l-2 border-b-2 border-stone-300 rounded-bl-2xl"
              style={{
                left: "0",
                top: "24px",
                width: "24px",
                height: "24px",
              }}
            ></div>
          </>
        )}

        <div className="flex items-center gap-2 group relative z-10">
          <div className="size-5 flex items-center justify-center shrink-0 z-10 bg-transparent">
            {hasChildren ? (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="size-5 flex items-center justify-center bg-white hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 border border-stone-200 rounded-xl shadow-sm text-stone-500 hover:text-amber-600 focus:outline-none transition-all duration-200 hover:shadow-md hover:scale-110"
                aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
              >
                {isExpanded ? (
                  <ChevronDown strokeWidth={2.5} className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight strokeWidth={2.5} className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 ring-2 ring-white shadow-sm"></div>
            )}
          </div>

          {(() => {
            return (
              <motion.div
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={cardVariants}
                className={`group/card relative flex flex-wrap items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/60 p-2.5 shadow-sm hover:shadow-2xl hover:border-amber-300/50 hover:bg-white/95 transition-all duration-300 overflow-hidden cursor-pointer
                ${data.person.is_deceased ? "opacity-75 grayscale-[0.2]" : ""}`}
                onClick={() => ctx.setMemberModalId(data.person.id)}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${getGradient()} opacity-0 group-hover/card:opacity-100 transition-opacity duration-300`}></div>

                <div className="flex items-center gap-3 relative z-10 w-full">
                  <div className="flex flex-1 items-center gap-3 min-w-0">
                    {ctx.showAvatar && (
                      <div className="relative shrink-0 group/avatar">
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getGradient()} opacity-0 group-hover/avatar:opacity-40 blur-xl transition-all duration-300 group-hover/avatar:scale-150`}></div>
                        
                        <div
                          className={`
                            relative size-11 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold shadow-lg ring-3 ${getRingColor()} transition-all duration-300 group-hover/card:scale-110 group-hover/card:shadow-xl
                            bg-gradient-to-br ${getGradient()}
                          `}
                        >
                          {data.person.avatar_url ? (
                            <Image
                              unoptimized
                              src={data.person.avatar_url}
                              alt={data.person.full_name}
                              width={44}
                              height={44}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <DefaultAvatar gender={data.person.gender} />
                          )}
                        </div>
                        
                        {!data.person.is_deceased && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
                        )}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-bold text-[15px] text-stone-900 group-hover/card:text-transparent group-hover/card:bg-gradient-to-r group-hover/card:from-amber-600 group-hover/card:to-orange-600 bg-clip-text transition-all duration-300 leading-tight truncate mb-1">
                        {data.person.full_name}
                      </span>
                      <span className={`text-[11px] ${getAccentColor()} font-medium truncate flex items-center gap-1.5`}>
                        <svg
                          className="size-3.5 text-stone-400 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="truncate bg-stone-50 px-2 py-0.5 rounded-full text-stone-600">
                          {formatDisplayDate(
                            data.person.birth_year,
                            data.person.birth_month,
                            data.person.birth_day,
                          )}
                          {data.person.is_deceased &&
                            ` → ${formatDisplayDate(data.person.death_year, data.person.death_month, data.person.death_day)}`}
                        </span>
                      </span>
                      {(data.person.is_deceased || data.person.is_in_law) && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2 shrink-0">
                          {data.person.is_in_law && (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
                                data.person.gender === "male"
                                  ? "bg-gradient-to-r from-blue-50 to-sky-50 text-blue-700 border-blue-200/60"
                                  : data.person.gender === "female"
                                    ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-rose-200/60"
                                    : "bg-stone-50 text-stone-700 border-stone-200/60"
                              }`}
                            >
                              {data.person.gender === "male" ? "👨 Rể" : data.person.gender === "female" ? "👩 Dâu" : "Khách"}
                            </span>
                          )}
                          {data.person.is_deceased && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border bg-gradient-to-r from-stone-50 to-zinc-50 text-stone-600 border-stone-200/60">
                              🕯️ Đã mất
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {data.spouses.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-2 pl-3 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-px before:h-[80%] before:bg-gradient-to-b before:from-stone-200 before:to-stone-300 before:rounded-full">
                      {data.spouses.map((spouseData) => {
                        const spouseGradient = spouseData.person.gender === "male" ? "from-blue-400 to-indigo-500" : "from-rose-400 to-fuchsia-500";
                        const spouseRing = spouseData.person.gender === "male" ? "ring-blue-100" : "ring-rose-100";
                          
                        return (
                          <motion.button
                            key={spouseData.person.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              ctx.setMemberModalId(spouseData.person.id);
                            }}
                            className={`flex flex-col items-center gap-1.5 bg-stone-50/50 hover:bg-white rounded-xl p-2 border border-stone-200/60 hover:border-amber-300 transition-all shadow-sm hover:shadow-md cursor-pointer group/spouse
                            ${spouseData.person.is_deceased ? "opacity-75 grayscale-[0.2]" : ""}`}
                            title={spouseData.note || (spouseData.person.gender === "male" ? "Chồng" : "Vợ")}
                          >
                            {ctx.showAvatar && (
                              <div className="relative">
                                <div
                                  className={`size-9 rounded-full overflow-hidden flex items-center justify-center text-white text-[10px] font-bold shadow-md ring-2 ${spouseRing} transition-transform duration-300 group-hover/spouse:scale-110 bg-gradient-to-br ${spouseGradient}`}
                                >
                                  {spouseData.person.avatar_url ? (
                                    <Image unoptimized src={spouseData.person.avatar_url} alt={spouseData.person.full_name} width={36} height={36} className="h-full w-full object-cover" />
                                  ) : (
                                    <DefaultAvatar gender={spouseData.person.gender} />
                                  )}
                                </div>
                                {!spouseData.person.is_deceased && (
                                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></div>
                                )}
                              </div>
                            )}
                            <span className="text-[10px] font-bold text-stone-600 truncate max-w-[60px] text-center group-hover/spouse:text-amber-700 transition-colors">
                              {spouseData.person.full_name.split(" ").pop()}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })()}
        </div>

        <AnimatePresence initial={false}>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94], opacity: { duration: 0.2 } }}
              className="origin-top relative z-0 mt-[-16px] pt-[16px] overflow-hidden"
            >
              <div className="pb-2">
                {data.children.map((child, index) => (
                  <MindmapNode
                    key={child.id}
                    personId={child.id}
                    level={level + 1}
                    isLast={index === data.children.length - 1}
                    ctx={ctx}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
MindmapNode.displayName = "MindmapNode";
