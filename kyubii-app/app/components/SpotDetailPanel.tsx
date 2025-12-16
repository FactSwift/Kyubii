"use client";

import {
  X,
  Clock,
  MapPin,
  Globe,
  Ticket,
  Bus,
  ExternalLink,
  Utensils,
  Mountain,
  Camera,
  Droplets,
} from "lucide-react";
import type { Spot, Category } from "../data";
import { courses } from "../data";
import { getSpotDetails } from "../spotDetails";

const categoryIcons: Record<Category, typeof Utensils> = {
  gourmet: Utensils,
  activity: Mountain,
  tourism: Camera,
  hotspring: Droplets,
};

const categoryColors: Record<Category, { bg: string; text: string }> = {
  gourmet: { bg: "bg-orange-100", text: "text-orange-700" },
  activity: { bg: "bg-green-100", text: "text-green-700" },
  tourism: { bg: "bg-blue-100", text: "text-blue-700" },
  hotspring: { bg: "bg-red-100", text: "text-red-700" },
};

interface SpotDetailPanelProps {
  spot: Spot;
  onClose: () => void;
}

export default function SpotDetailPanel({ spot, onClose }: SpotDetailPanelProps) {
  const details = getSpotDetails(spot.id);
  const primaryCategory = spot.categories[0] as Category | undefined;

  // Find which courses serve this spot
  const servingCourses = courses.filter((course) =>
    course.spotIds.includes(spot.id)
  );

  // Header gradient based on category
  const headerGradient = spot.isBusStop
    ? "from-gray-500 to-gray-600"
    : primaryCategory === "gourmet"
    ? "from-orange-500 to-orange-600"
    : primaryCategory === "activity"
    ? "from-green-500 to-green-600"
    : primaryCategory === "hotspring"
    ? "from-red-500 to-red-600"
    : "from-blue-500 to-blue-600";

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className={`bg-gradient-to-r ${headerGradient} p-4 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold opacity-80 bg-white/20 px-2 py-0.5 rounded">
                #{spot.id}
              </span>
              {spot.isBusStop && <Bus className="h-4 w-4 opacity-80" />}
            </div>
            <h2 className="text-xl font-bold leading-tight">{spot.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category badges */}
        {spot.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {spot.categories.map((cat) => {
              const Icon = categoryIcons[cat];
              return (
                <span
                  key={cat}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/20"
                >
                  <Icon className="h-3 w-3" />
                  {cat === "hotspring" ? "Hot Spring" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {/* Description */}
        {details?.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {details.description}
            </p>
          </div>
        )}

        {/* Info sections */}
        <div className="space-y-4">
          {/* Address */}
          {details?.address && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Address
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {details.address}
                </p>
              </div>
            </div>
          )}

          {/* Business Hours */}
          {details?.businessHours && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Clock className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Hours
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {details.businessHours}
                </p>
              </div>
            </div>
          )}

          {/* Fees */}
          {details?.fees && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Ticket className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Fees
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {details.fees}
                </p>
              </div>
            </div>
          )}

          {/* Website */}
          {details?.website && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Globe className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Website
                </p>
                <a
                  href={details.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1"
                >
                  Visit Website <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* Bus Courses */}
          {servingCourses.length > 0 && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Bus className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Bus Routes
                </p>
                <div className="flex flex-wrap gap-2">
                  {servingCourses.map((course) => (
                    <span
                      key={course.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: course.color }}
                    >
                      <Bus className="h-3 w-3" />
                      Course {course.id}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
