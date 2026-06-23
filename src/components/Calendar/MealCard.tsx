"use client";

import type { Meal } from "@/lib/types";
import FamilyBadge from "@/components/Family/FamilyBadge";
import StarRating from "@/components/Family/StarRating";

interface MealCardProps {
  meal: Meal;
  slotIcon?: string | null;
  onEdit: (meal: Meal) => void;
  onDelete: (id: number) => void;
}

export default function MealCard({ meal, slotIcon, onEdit, onDelete }: MealCardProps) {
  return (
    <div className="group rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {slotIcon && <span className="mr-1">{slotIcon}</span>}
            {meal.menuName}
          </h4>
          {meal.restaurantName && (
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {meal.restaurantName}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(meal)}
            className="rounded p-1 text-xs text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(meal.id)}
            className="rounded p-1 text-xs text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
            title="Hapus"
          >
            🗑️
          </button>
        </div>
      </div>

      {meal.assignedMembers && meal.assignedMembers.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1">
          {meal.assignedMembers.map((code) => (
            <FamilyBadge key={code} code={code} size="sm" />
          ))}
        </div>
      )}

      {meal.activities && meal.activities.length > 0 && (
        <p className="mb-1 text-xs text-zinc-400 dark:text-zinc-500">
          {meal.activities.map((a) => `[[ ${a} ]]`).join(" ")}
        </p>
      )}

      {meal.notes && (
        <p className="mb-1 text-xs italic text-zinc-500 dark:text-zinc-400">
          {meal.notes}
        </p>
      )}

      {meal.rating && (
        <StarRating value={meal.rating} readonly />
      )}
    </div>
  );
}
