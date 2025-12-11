"use client";

import { useState } from "react";
import { X, Sparkles, Clock, Check } from "lucide-react";
import type { Category, TripDuration, TripPlan } from "../data";
import { categoryInfo, planTrip } from "../data";

interface TripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: (plan: TripPlan) => void;
}

export default function TripPlannerModal({
  isOpen,
  onClose,
  onPlanGenerated,
}: TripPlannerModalProps) {
  const [selectedInterests, setSelectedInterests] = useState<Category[]>([]);
  const [duration, setDuration] = useState<TripDuration>("half-day");

  if (!isOpen) return null;

  const categories: Category[] = ["gourmet", "activity", "tourism", "hotspring"];

  const toggleInterest = (cat: Category) => {
    setSelectedInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleGenerate = () => {
    const plan = planTrip(selectedInterests, duration);
    onPlanGenerated(plan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
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

        {/* Duration */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            How much time do you have?
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setDuration("half-day")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                duration === "half-day"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span className="font-medium text-sm">Half Day</span>
            </button>
            <button
              onClick={() => setDuration("full-day")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                duration === "full-day"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span className="font-medium text-sm">Full Day</span>
            </button>
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={selectedInterests.length === 0}
          className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Generate Trip Plan
        </button>

        <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
          {duration === "half-day" ? "~3 spots" : "~6 spots"} will be suggested
        </p>
      </div>
    </div>
  );
}
