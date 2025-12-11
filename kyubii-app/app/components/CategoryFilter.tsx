"use client";

import { Utensils, Mountain, Camera, Droplets } from "lucide-react";
import type { Category } from "../data";
import { categoryInfo } from "../data";

const iconMap = {
  gourmet: Utensils,
  activity: Mountain,
  tourism: Camera,
  hotspring: Droplets,
};

const colorMap: Record<Category, string> = {
  gourmet: "bg-orange-500",
  activity: "bg-green-500",
  tourism: "bg-blue-500",
  hotspring: "bg-red-500",
};

const hoverColorMap: Record<Category, string> = {
  gourmet: "hover:bg-orange-600",
  activity: "hover:bg-green-600",
  tourism: "hover:bg-blue-600",
  hotspring: "hover:bg-red-600",
};

const inactiveColorMap: Record<Category, string> = {
  gourmet: "bg-orange-100 text-orange-600 hover:bg-orange-200",
  activity: "bg-green-100 text-green-600 hover:bg-green-200",
  tourism: "bg-blue-100 text-blue-600 hover:bg-blue-200",
  hotspring: "bg-red-100 text-red-600 hover:bg-red-200",
};

interface CategoryFilterProps {
  selectedCategories: Category[];
  onToggle: (category: Category) => void;
}

export default function CategoryFilter({
  selectedCategories,
  onToggle,
}: CategoryFilterProps) {
  const categories: Category[] = ["gourmet", "activity", "tourism", "hotspring"];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const Icon = iconMap[cat];
        const isSelected = selectedCategories.includes(cat);

        return (
          <button
            key={cat}
            onClick={() => onToggle(cat)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isSelected
                ? `${colorMap[cat]} ${hoverColorMap[cat]} text-white`
                : inactiveColorMap[cat]
            }`}
          >
            <Icon className="h-4 w-4" />
            {categoryInfo[cat].label}
          </button>
        );
      })}
    </div>
  );
}
