"use client";

import { Person } from "@/types";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useDashboard } from "./DashboardContext";
import DefaultAvatar from "./DefaultAvatar";

interface FamilyNodeCardProps {
  person: Person;
  role?: string; // e.g., "Chồng", "Vợ"
  note?: string | null;
  onClickCard?: () => void;
  onClickName?: (e: React.MouseEvent) => void;
  isExpandable?: boolean;
  isExpanded?: boolean;
  isRingVisible?: boolean;
  isPlusVisible?: boolean;
  level: number;
  isCompact?: boolean;
}

export default function FamilyNodeCard({
  person,
  onClickCard,
  onClickName,
  isExpandable = false,
  isExpanded = false,
  isRingVisible = false,
  isPlusVisible = false,
  isCompact = false,
}: FamilyNodeCardProps) {
  const { showAvatar, setMemberModalId } = useDashboard();

  const isDeceased = person.is_deceased;
  
  // Dynamic gradient based on gender
  const getGradient = () => {
    if (person.gender === "male") {
      return "from-blue-400 via-blue-500 to-indigo-600";
    } else if (person.gender === "female") {
      return "from-rose-400 via-pink-500 to-fuchsia-500";
    }
    return "from-stone-400 via-stone-500 to-zinc-600";
  };

  // Dynamic ring color based on gender
  const getRingColor = () => {
    if (person.gender === "male") {
      return "ring-blue-200";
    } else if (person.gender === "female") {
      return "ring-rose-200";
    }
    return "ring-stone-200";
  };

  const content = (
    <div
      onClick={onClickCard}
      className={`
        group flex flex-col items-center justify-start transition-all duration-300 hover:-translate-y-1 rounded-xl relative h-full
        ${isDeceased ? "grayscale-[0.4] opacity-80" : ""}
        ${showAvatar 
          ? isCompact 
            ? "w-14 sm:w-16 py-1.5 px-0.5 bg-white/90 hover:shadow-xl hover:bg-white" 
            : "w-20 sm:w-24 md:w-28 py-2 px-1 bg-white/90 hover:shadow-2xl hover:bg-white" 
          : "px-3"}
      `}
    >
      {isRingVisible && (
        <div
          className={`
            absolute top-[10%] -left-1.5 sm:-left-2 size-4 sm:size-5 rounded-full z-100 flex items-center justify-center text-[9px] sm:text-xs font-medium text-stone-500 animate-pulse
            ${showAvatar ? "shadow-md bg-white" : ""}
          `}
        >
          <span className="leading-none">💍</span>
        </div>
      )}
      {isPlusVisible && (
        <div
          className={`
            absolute top-[10%] -left-1.5 sm:-left-2 size-4 sm:size-5 rounded-full z-100 flex items-center justify-center text-[9px] sm:text-xs font-medium text-stone-500
            ${showAvatar ? "shadow-sm bg-white" : ""}
          `}
        >
          <span className="leading-none">+</span>
        </div>
      )}

      {/* Expand/Collapse Indicator */}
      {isExpandable && (
        <div className={`absolute left-1/2 -translate-x-1/2 bg-white border border-stone-200/80 rounded-full flex items-center justify-center shadow-md z-100 text-stone-500 hover:text-amber-600 transition-colors ${isCompact ? "-bottom-2 size-5" : "-bottom-3 size-6"}`}>
          {isExpanded ? (
            <Minus className={isCompact ? "w-3 h-3" : "w-3.5 h-3.5"} />
          ) : (
            <Plus className={isCompact ? "w-3 h-3" : "w-3.5 h-3.5"} />
          )}
        </div>
      )}

      {/* 1. Avatar */}
      {showAvatar && (
        <div className={`relative z-10 group/avatar ${isCompact ? "mb-1" : "mb-1.5 sm:mb-2"}`}>
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getGradient()} opacity-0 group-hover/avatar:opacity-30 blur-xl transition-opacity duration-300`}></div>
          
          <div
            className={`
              relative rounded-full flex items-center justify-center text-white overflow-hidden shrink-0 shadow-lg ring-3 ${getRingColor()} transition-all duration-300 group-hover/avatar:scale-110 group-hover/avatar:shadow-xl
              bg-gradient-to-br ${getGradient()}
              ${isCompact 
                ? "h-8 w-8 text-[9px]" 
                : "h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-[10px] sm:text-xs md:text-sm"}
            `}
          >
            {person.avatar_url ? (
              <Image
                unoptimized
                src={person.avatar_url}
                alt={person.full_name}
                className="w-full h-full object-cover"
                width={64}
                height={64}
              />
            ) : (
              <DefaultAvatar gender={person.gender} />
            )}
          </div>
          
          {/* Online/Status indicator */}
          {!isDeceased && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          )}
        </div>
      )}

      {/* 2. Gender Icon + Name */}
      <div className={`flex flex-col items-center justify-center gap-0.5 w-full ${isCompact ? "px-0.5" : "px-0.5 sm:px-1"} relative z-10`}>
        <div
          className={`
            font-bold text-center leading-tight transition-all duration-300 cursor-pointer
            ${onClickName ? "text-stone-800 group-hover:text-amber-700 hover:underline" : "text-stone-800 group-hover:text-amber-800"}
            ${showAvatar ? "" : "bg-gradient-to-r from-stone-700 to-stone-900 bg-clip-text text-transparent"}
            ${isCompact ? "text-[9px] sm:text-[10px]" : "text-[10px] sm:text-[11px] md:text-xs"}
          `}
          title={person.full_name}
          onClick={(e) => {
            if (onClickName) {
              e.stopPropagation();
              e.preventDefault();
              onClickName(e);
            }
          }}
        >
          {showAvatar
            ? person.full_name
            : person.full_name.split(" ").map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              ))}
        </div>
        
        {/* Birth year badge */}
        {person.birth_year && (
          <span className={`text-stone-500 font-medium bg-stone-100 rounded-full ${isCompact ? "text-[8px] px-1 py-0" : "text-[9px] sm:text-[10px] px-1.5 py-0.5"}`}>
            {person.birth_year}
          </span>
        )}
      </div>
    </div>
  );

  if (onClickCard || onClickName) {
    return content;
  }

  return (
    <button onClick={() => setMemberModalId(person.id)} className="block w-fit">
      {content}
    </button>
  );
}
