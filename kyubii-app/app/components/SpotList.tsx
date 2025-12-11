"use client";

import { MapPin, Utensils, Mountain, Camera, Droplets, Bus } from "lucide-react";
import type { Spot, Category } from "../data";

const categoryIcons: Record<Category, typeof Utensils> = {
  gourmet: Utensils,
  activity: Mountain,
  tourism: Camera,
  hotspring: Droplets,
};

const categoryColors: Record<Category, string> = {
  gourmet: "text-orange-500",
  activity: "text-green-500",
  tourism: "text-blue-500",
  hotspring: "text-red-500",
};

interface SpotListProps {
  spots: Spot[];
  onSpotClick?: (spot: Spot) => void;
  highlightedSpotId?: number | null;
  showSuspended?: boolean;
}

export default function SpotList({
  spots,
  onSpotClick,
  highlightedSpotId,
  showSuspended = true,
}: SpotListProps) {
  // Sort by ID
  const sortedSpots = [...spots].sort((a, b) => a.id - b.id);

  return (
    <div className="flex flex-col gap-2">
      {sortedSpots.map((spot) => {
        const isHighlighted = highlightedSpotId === spot.id;
        const isSuspended = spot.status === "suspended";
        const primaryCategory = spot.categories[0] as Category | undefined;

        if (isSuspended && !showSuspended) return null;

        return (
          <button
            key={spot.id}
            onClick={() => !isSuspended && onSpotClick?.(spot)}
            disabled={isSuspended}
            className={`flex items-center gap-3 rounded-lg p-3 text-left transition-all ${
              isHighlighted
                ? "bg-blue-100 ring-2 ring-blue-500 dark:bg-blue-900/30"
                : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
            } ${isSuspended ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          >
            {/* Spot number badge */}
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                spot.isBusStop
                  ? "bg-gray-500"
                  : primaryCategory
                  ? {
                      gourmet: "bg-orange-500",
                      activity: "bg-green-500",
                      tourism: "bg-blue-500",
                      hotspring: "bg-red-500",
                    }[primaryCategory]
                  : "bg-gray-500"
              }`}
            >
              {spot.id}
            </div>

            {/* Spot info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium text-sm">{spot.name}</span>
                {isSuspended && (
                  <span className="flex-shrink-0 rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500">
                    Suspended
                  </span>
                )}
              </div>

              {/* Category icons */}
              <div className="mt-1 flex items-center gap-2">
                {spot.isBusStop ? (
                  <Bus className="h-3.5 w-3.5 text-gray-500" />
                ) : (
                  spot.categories.map((cat) => {
                    const Icon = categoryIcons[cat];
                    return (
                      <Icon
                        key={cat}
                        className={`h-3.5 w-3.5 ${categoryColors[cat]}`}
                      />
                    );
                  })
                )}
              </div>
            </div>

            {/* Pin icon for non-bus-stops */}
            {!spot.isBusStop && !isSuspended && (
              <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}
