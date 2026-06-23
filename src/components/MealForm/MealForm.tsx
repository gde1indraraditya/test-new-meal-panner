"use client";

import { useEffect, useState } from "react";
import type { Meal, MealSlot } from "@/lib/types";
import FamilyPicker from "./FamilyPicker";
import StarRating from "@/components/Family/StarRating";

interface MealFormProps {
  meal: Meal | null;
  date: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function MealForm({ meal, date, onClose, onSaved }: MealFormProps) {
  const [slots, setSlots] = useState<MealSlot[]>([]);
  const [menuName, setMenuName] = useState(meal?.menuName ?? "");
  const [restaurantName, setRestaurantName] = useState(meal?.restaurantName ?? "");
  const [mealSlotId, setMealSlotId] = useState(meal?.mealSlotId ?? 1);
  const [assignedMembers, setAssignedMembers] = useState<string[]>(meal?.assignedMembers ?? []);
  const [activities, setActivities] = useState(meal?.activities?.join(", ") ?? "");
  const [notes, setNotes] = useState(meal?.notes ?? "");
  const [rating, setRating] = useState<number | null>(meal?.rating ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/meal-slots")
      .then((r) => r.json())
      .then(setSlots);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuName.trim()) {
      setError("Nama menu wajib diisi");
      return;
    }
    setSaving(true);
    setError("");

    const body = {
      date,
      mealSlotId,
      menuName: menuName.trim(),
      restaurantName: restaurantName.trim() || null,
      assignedMembers: assignedMembers.length > 0 ? assignedMembers : null,
      activities: activities.trim() ? activities.split(",").map((a) => a.trim()).filter(Boolean) : null,
      notes: notes.trim() || null,
      rating,
    };

    try {
      const url = meal ? `/api/meals/${meal.id}` : "/api/meals";
      const method = meal ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Gagal menyimpan");
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {meal ? "Edit Makanan" : "Tambah Makanan"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Menu *</label>
            <input
              type="text"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Nasi Goreng..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tanggal</label>
              <input
                type="date"
                value={date}
                disabled
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Waktu</label>
              <select
                value={mealSlotId}
                onChange={(e) => setMealSlotId(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {slots.map((s) => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Restoran</label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Opsional"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Yang Makan</label>
            <FamilyPicker selected={assignedMembers} onChange={setAssignedMembers} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Aktivitas <span className="text-xs text-zinc-400">(pisahkan dengan koma)</span>
            </label>
            <input
              type="text"
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="AA Kantor, Dika Les"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Catatan</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Enak / Kurang enak / Tutup..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Rating</label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : meal ? "Simpan" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
