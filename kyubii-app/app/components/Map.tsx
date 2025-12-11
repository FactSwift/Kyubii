"use client";

import dynamic from "next/dynamic";
import type { Spot, Course } from "../data";

// Dynamic import with SSR disabled to avoid "window is not defined" error
const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  ),
});

interface MapProps {
  spots: Spot[];
  selectedCourse: Course | null;
  onSpotClick?: (spot: Spot) => void;
  highlightedSpotId?: number | null;
}

export default function Map({
  spots,
  selectedCourse,
  onSpotClick,
  highlightedSpotId,
}: MapProps) {
  return (
    <MapContent
      spots={spots}
      selectedCourse={selectedCourse}
      onSpotClick={onSpotClick}
      highlightedSpotId={highlightedSpotId}
    />
  );
}
