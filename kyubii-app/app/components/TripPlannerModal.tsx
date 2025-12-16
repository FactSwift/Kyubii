"use client";

import { useState, useMemo } from "react";
import { X, Sparkles, Clock, MapPin, Check, ChevronDown, ChevronUp } from "lucide-react";
import type { Category, TripPlan } from "../data";
import { categoryInfo, planTripAdvanced } from "../data";

interface TripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: (plan: TripPlan) => void;
}

// Category time preferences in minutes
export interface CategoryTimePrefs {
  gourmet: number;
  activity: number;
  tourism: number;
  hotspring: number;
}

export interface TripPreferences {
  totalTimeHours: number;
  categoryTimes: CategoryTimePrefs;
  maxDistanceKm: number;
  selectedCategories: Category[];
}

export default function TripPlannerModal({
  isOpen,
  onClose,
  onPlanGenerated,
}: TripPlannerModalProps) {
  const [selectedInterests, setSelectedInterests] = useState<Category[]>([]);
  const [totalTimeHours, setTotalTimeHours] = useState(4); // Default 4 hours
  const [maxDistanceKm, setMaxDistanceKm] = useState(10); // Default 10km radius
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Time allocation per category (in minutes, how much time to spend at spots of each type)
  const [categoryTimes, setCategoryTimes] = useState<CategoryTimePrefs>({
    gourmet: 60,     // 1 hour for restaurants
    activity: 90,    // 1.5 hours for activities
    tourism: 45,     // 45 min for sightseeing
    hotspring: 120,  // 2 hours for hot springs
  });

  // Calculate estimated spots based on preferences (must be before early return)
  const estimatedSpots = useMemo(() => {
    if (selectedInterests.length === 0) return 0;
    
    const totalMinutes = totalTimeHours * 60;
    const travelTimePerSpot = 15; // 15 min travel between spots on average
    
    // Calculate average time per spot based on selected categories
    const avgTimePerSpot = selectedInterests.reduce(
      (sum, cat) => sum + categoryTimes[cat], 0
    ) / selectedInterests.length;
    
    // Each spot takes: time at spot + travel time
    const timePerSpot = avgTimePerSpot + travelTimePerSpot;
    
    return Math.max(1, Math.floor(totalMinutes / timePerSpot));
  }, [totalTimeHours, selectedInterests, categoryTimes]);

  if (!isOpen) return null;

  const categories: Category[] = ["gourmet", "activity", "tourism", "hotspring"];

  const toggleInterest = (cat: Category) => {
    setSelectedInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const updateCategoryTime = (cat: Category, minutes: number) => {
    setCategoryTimes((prev) => ({
      ...prev,
      [cat]: minutes,
    }));
  };

  const handleGenerate = () => {
    const prefs: TripPreferences = {
      totalTimeHours,
      categoryTimes,
      maxDistanceKm,
      selectedCategories: selectedInterests,
    };
    const plan = planTripAdvanced(prefs);
    onPlanGenerated(plan);
    onClose();
  };

  // Format time display
  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h} hour${h > 1 ? 's' : ''}`;
  };

  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h} hour${h > 1 ? 's' : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 custom-scrollbar">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h2 className="text-xl font-bold">Plan My Trip</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Total Time in Nasu */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Clock className="h-4 w-4 text-purple-500" />
            How long will you be in Nasu?
          </h3>
          <div className="px-2">
            <input
              type="range"
              min={1}
              max={8}
              step={0.5}
              value={totalTimeHours}
              onChange={(e) => setTotalTimeHours(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500 dark:bg-gray-700"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>1 hour</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400 text-sm">
                {formatTime(totalTimeHours)}
              </span>
              <span>8 hours</span>
            </div>
          </div>
        </div>

        {/* Distance to Explore */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <MapPin className="h-4 w-4 text-blue-500" />
            How far do you want to explore?
          </h3>
          <div className="px-2">
            <input
              type="range"
              min={2}
              max={20}
              step={1}
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 dark:bg-gray-700"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>2 km</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
                {maxDistanceKm} km radius
              </span>
              <span>20 km</span>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            What are you interested in?
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleInterest(cat)}
                className={`flex items-center justify-between rounded-lg border-2 p-3 transition-all ${
                  selectedInterests.includes(cat)
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                }`}
              >
                <span className="font-medium text-sm">
                  {categoryInfo[cat].label}
                </span>
                {selectedInterests.includes(cat) && (
                  <Check className="h-4 w-4 text-purple-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Settings - Time per Category */}
        <div className="mb-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            Advanced: Time per category
          </button>
          
          {showAdvanced && (
            <div className="mt-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Set how much time you typically spend at each type of spot:
              </p>
              {categories.map((cat) => (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {categoryInfo[cat].label}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      {formatMinutes(categoryTimes[cat])}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={180}
                    step={15}
                    value={categoryTimes[cat]}
                    onChange={(e) => updateCategoryTime(cat, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500 dark:bg-gray-600"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {selectedInterests.length > 0 && (
          <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Estimated spots:</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                ~{estimatedSpots} locations
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">Exploration area:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {maxDistanceKm} km from center
              </span>
            </div>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={selectedInterests.length === 0}
          className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Generate Trip Plan
        </button>

        <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
          We'll find the best route based on your preferences
        </p>
      </div>
    </div>
  );
}
