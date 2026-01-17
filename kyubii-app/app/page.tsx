"use client";

import { useState, useMemo } from "react";
import {
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  Sparkles,
  MapPin,
  Route,
  ArrowLeft,
} from "lucide-react";
import {
  Map,
  CategoryFilter,
  CourseSelector,
  SpotList,
  TripPlannerModal,
  SpotDetailPanel,
} from "./components";
import type { Spot, Category, Course, TripPlan } from "./data";
import { spots, getVisibleSpots, filterSpotsByCategories, getSpotById } from "./data";

export default function Home() {
  // State
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [highlightedSpotId, setHighlightedSpotId] = useState<number | null>(null);
  const [selectedSpotIds, setSelectedSpotIds] = useState<number[]>([]);
  const [viewingSpotId, setViewingSpotId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);

  // Filter spots based on selected categories and individual spot selection
  const filteredSpots = useMemo(() => {
    let filtered = filterSpotsByCategories(selectedCategories);

    // If a trip plan is active, show only planned spots
    if (tripPlan) {
      const plannedIds = tripPlan.spots.map((s) => s.id);
      filtered = filtered.filter((s) => plannedIds.includes(s.id));
    }
    // If specific spots are selected, show only those
    else if (selectedSpotIds.length > 0) {
      filtered = filtered.filter((s) => selectedSpotIds.includes(s.id));
    }

    return filtered;
  }, [selectedCategories, tripPlan, selectedSpotIds]);

  // All spots for the list (including suspended for display)
  const allSpotsForList = useMemo(() => {
    if (tripPlan) {
      return tripPlan.spots;
    }
    return spots.filter(
      (s) =>
        selectedCategories.length === 0 ||
        s.categories.some((c) => selectedCategories.includes(c)) ||
        s.status === "suspended"
    );
  }, [selectedCategories, tripPlan]);

  const toggleCategory = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setTripPlan(null); // Clear trip plan when manually filtering
    setSelectedSpotIds([]); // Clear individual spot selection
  };

  // Toggle individual spot selection
  const toggleSpotSelection = (spotId: number) => {
    setSelectedSpotIds((prev) =>
      prev.includes(spotId)
        ? prev.filter((id) => id !== spotId)
        : [...prev, spotId]
    );
    setTripPlan(null); // Clear trip plan when manually selecting
  };

  // Clear all spot selections
  const clearSpotSelection = () => {
    setSelectedSpotIds([]);
  };

  const handleSpotClick = (spot: Spot) => {
    setHighlightedSpotId(spot.id);
    setViewingSpotId(spot.id);
    // On mobile, expand bottom sheet when a spot is clicked
    setIsBottomSheetExpanded(true);
  };

  const handleCloseSpotDetail = () => {
    setViewingSpotId(null);
  };

  // Get the spot being viewed
  const viewingSpot = viewingSpotId ? getSpotById(viewingSpotId) : null;

  const handlePlanGenerated = (plan: TripPlan) => {
    setTripPlan(plan);
    if (plan.recommendedCourse) {
      setSelectedCourse(plan.recommendedCourse);
    }
    setSelectedCategories([]);
  };

  const clearTripPlan = () => {
    setTripPlan(null);
    setSelectedCourse(null);
    setSelectedSpotIds([]);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Map - Full screen background */}
      <div className="absolute inset-0 z-0">
        <Map
          spots={filteredSpots}
          selectedCourse={tripPlan?.recommendedCourse ?? selectedCourse}
          onSpotClick={handleSpotClick}
          highlightedSpotId={highlightedSpotId}
        />
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`absolute left-0 top-0 z-[100] hidden h-full w-96 transform bg-white/95 shadow-xl backdrop-blur-sm transition-transform dark:bg-gray-900/95 lg:block ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Show Spot Detail Panel when viewing a spot */}
        {viewingSpot ? (
          <div className="flex h-full flex-col">
            {/* Back button header */}
            <div className="border-b border-gray-200 p-3 dark:border-gray-700">
              <button
                onClick={handleCloseSpotDetail}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to list
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <SpotDetailPanel spot={viewingSpot} onClose={handleCloseSpotDetail} />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    NASU Navi
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nasu Tourism Guide
                  </p>
                </div>
                <button
                  onClick={() => setIsPlannerOpen(true)}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <Sparkles className="h-4 w-4" />
                  Plan Trip
                </button>
              </div>

              {/* Trip Plan Banner */}
              {tripPlan && (
                <div className="mt-4 rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        Trip Plan Active ({tripPlan.spots.length} spots)
                      </span>
                    </div>
                    <button
                      onClick={clearTripPlan}
                      className="text-purple-600 hover:text-purple-800 dark:text-purple-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {(tripPlan.totalTravelTime || tripPlan.totalDistance) && (
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-purple-600 dark:text-purple-400">
                      {tripPlan.totalTravelTime && (
                        <span>🚗 {tripPlan.totalTravelTime} min travel</span>
                      )}
                      {tripPlan.totalActivityTime && (
                        <span>⏱️ {tripPlan.totalActivityTime} min activities</span>
                      )}
                      {tripPlan.totalDistance && (
                        <span>📍 {tripPlan.totalDistance} km</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Categories
              </h3>
              <CategoryFilter
                selectedCategories={selectedCategories}
                onToggle={toggleCategory}
              />
            </div>

            {/* Course Selector */}
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Bus Routes
              </h3>
              <CourseSelector
                selectedCourse={tripPlan?.recommendedCourse ?? selectedCourse}
                onSelect={(course) => {
                  setSelectedCourse(course);
                  if (tripPlan) clearTripPlan();
                }}
              />
            </div>

            {/* Spot List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Spots ({allSpotsForList.length})
                </h3>
                {selectedSpotIds.length > 0 && (
                  <button
                    onClick={clearSpotSelection}
                    className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {selectedSpotIds.length} selected
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <SpotList
                spots={allSpotsForList}
                onSpotClick={handleSpotClick}
                onSpotSelect={toggleSpotSelection}
                highlightedSpotId={highlightedSpotId}
                selectedSpotIds={selectedSpotIds}
                showSuspended={!tripPlan}
                selectionMode={true}
              />
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <header className="absolute left-0 right-0 top-0 z-[100] flex items-center justify-between bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:bg-gray-900/90 lg:hidden">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            NASU Navi
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Nasu Digital Map
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlannerOpen(true)}
            className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-2 text-white"
          >
            <Sparkles className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-[100] transform rounded-t-3xl bg-white/95 shadow-2xl backdrop-blur-sm transition-transform dark:bg-gray-900/95 lg:hidden bottom-sheet ${
          isBottomSheetExpanded ? "" : "collapsed"
        }`}
        style={{ maxHeight: "70vh" }}
      >
        {/* Handle */}
        <button
          onClick={() => setIsBottomSheetExpanded(!isBottomSheetExpanded)}
          className="flex w-full items-center justify-center py-3"
        >
          <div className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
        </button>

        {/* Trip Plan Banner (Mobile) */}
        {tripPlan && (
          <div className="mx-4 mb-2 rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Route className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  Trip Plan ({tripPlan.spots.length} spots)
                </span>
              </div>
              <button
                onClick={clearTripPlan}
                className="text-purple-600 hover:text-purple-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {(tripPlan.totalTravelTime || tripPlan.totalDistance) && (
              <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-purple-600 dark:text-purple-400">
                {tripPlan.totalTravelTime && <span>🚗 {tripPlan.totalTravelTime}m</span>}
                {tripPlan.totalActivityTime && <span>⏱️ {tripPlan.totalActivityTime}m</span>}
                {tripPlan.totalDistance && <span>📍 {tripPlan.totalDistance}km</span>}
              </div>
            )}
          </div>
        )}

        {/* Collapsed view */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {allSpotsForList.length} Spots
            </span>
            {isBottomSheetExpanded ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Expanded content */}
        {isBottomSheetExpanded && (
          <div
            className="overflow-y-auto px-4 pb-8 custom-scrollbar"
            style={{ maxHeight: "calc(70vh - 120px)" }}
          >
            {viewingSpot ? (
              /* Show Spot Detail Panel when viewing a spot */
              <div className="flex flex-col">
                <button
                  onClick={handleCloseSpotDetail}
                  className="mb-3 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to list
                </button>
                <SpotDetailPanel spot={viewingSpot} onClose={handleCloseSpotDetail} />
              </div>
            ) : (
              /* Normal filters and list view */
              <>
                {/* Category filter */}
                <div className="mb-4">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Filter
                  </h3>
                  <CategoryFilter
                    selectedCategories={selectedCategories}
                    onToggle={toggleCategory}
                  />
                </div>

                {/* Course selector */}
                <div className="mb-4">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Routes
                  </h3>
                  <CourseSelector
                    selectedCourse={tripPlan?.recommendedCourse ?? selectedCourse}
                    onSelect={(course) => {
                      setSelectedCourse(course);
                      if (tripPlan) clearTripPlan();
                    }}
                  />
                </div>

                {/* Spots */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Spots
                    </h3>
                    {selectedSpotIds.length > 0 && (
                      <button
                        onClick={clearSpotSelection}
                        className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {selectedSpotIds.length} selected
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <SpotList
                    spots={allSpotsForList}
                    onSpotClick={handleSpotClick}
                    onSpotSelect={toggleSpotSelection}
                    highlightedSpotId={highlightedSpotId}
                    selectedSpotIds={selectedSpotIds}
                    showSuspended={!tripPlan}
                    selectionMode={true}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Trip Planner Modal */}
      <TripPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        onPlanGenerated={handlePlanGenerated}
      />
    </div>
  );
}
