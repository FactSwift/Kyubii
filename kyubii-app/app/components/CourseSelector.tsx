"use client";

import type { Course } from "../data";
import { courses } from "../data";

interface CourseSelectorProps {
  selectedCourse: Course | null;
  onSelect: (course: Course | null) => void;
}

export default function CourseSelector({
  selectedCourse,
  onSelect,
}: CourseSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selectedCourse === null
            ? "bg-gray-800 text-white dark:bg-white dark:text-gray-900"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}
      >
        All Routes
      </button>
      {courses.map((course) => (
        <button
          key={course.id}
          onClick={() => onSelect(course)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors`}
          style={{
            backgroundColor:
              selectedCourse?.id === course.id ? course.color : undefined,
            color: selectedCourse?.id === course.id ? "white" : course.color,
            border: `2px solid ${course.color}`,
          }}
        >
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: course.color }}
          />
          {course.name}
        </button>
      ))}
    </div>
  );
}
