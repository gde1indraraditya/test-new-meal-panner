"use client";

import { useEffect, useState, useCallback } from "react";
import type { Meal, MealSlot } from "@/lib/types";
import { formatDate, formatDisplay, getWeekRange, getDaysOfWeek, getWeekNumber } from "@/lib/dates";
import MealCard from "./MealCard";
import MealForm from "@/components/MealForm/MealForm";

export default function WeeklyCalendar() {
  const [today] = useState(() => new Date());
  const [currentMonday, setCurrentMonday] = useState(() => getWeekRange(new Date()).startDate);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [slots, setSlots] = useState<MealSlot[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formDate, setFormDate] = useState("");
  const [editMeal, setEditMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  const { startDate, endDate } = getWeekRange(currentMonday);
  const days = getDaysOfWeek(currentMonday);
  const weekLabel = `Minggu ${getWeekNumber(currentMonday)}`;

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    try {
      const res = await fetch(`/api/meals?startDate=${start}&endDate=${end}`);
      const data = await res.json();
      setMeals(data);
    } catch {
      console.error("Failed to fetch meals");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  const fetchSlots = useCallback(async () => {
    const res = await fetch("/api/meal-slots");
    const data = await res.json();
    setSlots(data);
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const getMealsForDaySlot = (date: string, slotId: number) => {
    return meals.filter((m) => m.date === date && m.mealSlotId === slotId);
  };

  const prevWeek = () => {
    const prev = new Date(currentMonday);
    prev.setDate(prev.getDate() - 7);
    setCurrentMonday(prev);
  };

  const nextWeek = () => {
    const next = new Date(currentMonday);
    next.setDate(next.getDate() + 7);
    setCurrentMonday(next);
  };

  const goToToday = () => {
    setCurrentMonday(getWeekRange(new Date()).startDate);
  };

  const openAddForm = (date: string) => {
    setEditMeal(null);
    setFormDate(date);
    setFormOpen(true);
  };

  const openEditForm = (meal: Meal) => {
    setEditMeal(meal);
    setFormDate(meal.date);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus makanan ini?")) return;
    try {
      await fetch(`/api/meals/${id}`, { method: "DELETE" });
      fetchMeals();
    } catch {
      console.error("Failed to delete");
    }
  };

  const handleSaved = () => {
    setFormOpen(false);
    setEditMeal(null);
    fetchMeals();
  };

  const slotIcon = (slotId: number) => slots.find((s) => s.id === slotId)?.icon;

  const isCurrentWeek = formatDate(getWeekRange(new Date()).startDate) === formatDate(currentMonday);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Meal Panner</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatDisplay(startDate)} — {formatDisplay(endDate)} &middot; {weekLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevWeek}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            ←
          </button>
          <button
            onClick={goToToday}
            disabled={isCurrentWeek}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-30 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            Hari Ini
          </button>
          <button
            onClick={nextWeek}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="grid min-w-[768px] grid-cols-7 gap-3">
          {days.map((day) => {
            const dateStr = formatDate(day);
            const isToday = dateStr === formatDate(today);
            const dayName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"][day.getDay()];

            return (
              <div key={dateStr} className="flex flex-col">
                {/* Day Header */}
                <div
                  className={`mb-2 rounded-lg px-3 py-2 text-center ${
                    isToday
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  <div className="text-xs font-medium">{dayName}</div>
                  <div className="text-lg font-bold">{day.getDate()}</div>
                </div>

                {/* Slot Columns */}
                <div className="flex flex-col gap-2">
                  {slots.map((slot) => {
                    const slotMeals = getMealsForDaySlot(dateStr, slot.id);
                    return (
                      <div key={slot.id} className="min-h-[100px]">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                            {slot.icon} {slot.name}
                          </span>
                          <button
                            onClick={() => openAddForm(dateStr)}
                            className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400"
                          >
                            + Tambah
                          </button>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {slotMeals.map((meal) => (
                            <MealCard
                              key={meal.id}
                              meal={meal}
                              slotIcon={slot.icon}
                              onEdit={openEditForm}
                              onDelete={handleDelete}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="mt-4 text-center text-sm text-zinc-400">Memuat...</div>
      )}

      {/* Floating add button for small screens */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          onClick={() => openAddForm(formatDate(today))}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-lg hover:bg-blue-700"
        >
          +
        </button>
      </div>

      {/* Meal Form Modal */}
      {formOpen && (
        <MealForm
          meal={editMeal}
          date={formDate}
          onClose={() => { setFormOpen(false); setEditMeal(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
