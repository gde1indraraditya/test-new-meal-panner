import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MealCard from "../MealCard";
import type { Meal } from "@/lib/types";

const baseMeal: Meal = {
  id: 1,
  date: "2024-11-07",
  mealSlotId: 1,
  menuName: "Nasi Goreng",
  restaurantName: null,
  assignedMembers: null,
  activities: null,
  notes: null,
  rating: null,
  createdAt: "2024-11-07T00:00:00Z",
  updatedAt: "2024-11-07T00:00:00Z",
};

describe("MealCard", () => {
  it("renders menu name", () => {
    render(<MealCard meal={baseMeal} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Nasi Goreng")).toBeInTheDocument();
  });

  it("renders restaurant name when present", () => {
    const meal = { ...baseMeal, restaurantName: "Warung Java" };
    render(<MealCard meal={meal} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Warung Java")).toBeInTheDocument();
  });

  it("renders slot icon when provided", () => {
    render(<MealCard meal={baseMeal} slotIcon="🍽️" onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("🍽️")).toBeInTheDocument();
  });

  it("renders assigned member badges", () => {
    const meal = { ...baseMeal, assignedMembers: ["AA", "Dika"] };
    render(<MealCard meal={meal} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("AA")).toBeInTheDocument();
    expect(screen.getByText("Dika")).toBeInTheDocument();
  });

  it("renders activities", () => {
    const meal = { ...baseMeal, activities: ["AA Kantor", "Dika Les"] };
    render(<MealCard meal={meal} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("[[ AA Kantor ]] [[ Dika Les ]]")).toBeInTheDocument();
  });

  it("renders notes", () => {
    const meal = { ...baseMeal, notes: "Enak banget" };
    render(<MealCard meal={meal} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Enak banget")).toBeInTheDocument();
  });

  it("renders star rating", () => {
    const meal = { ...baseMeal, rating: 4 };
    render(<MealCard meal={meal} onEdit={vi.fn()} onDelete={vi.fn()} />);
    const filled = screen.getAllByText("★");
    expect(filled).toHaveLength(4);
  });

  it("calls onEdit when edit button clicked", () => {
    const onEdit = vi.fn();
    render(<MealCard meal={baseMeal} onEdit={onEdit} onDelete={vi.fn()} />);
    const editBtn = screen.getByTitle("Edit");
    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledWith(baseMeal);
  });

  it("calls onDelete when delete button clicked", () => {
    const onDelete = vi.fn();
    render(<MealCard meal={baseMeal} onEdit={vi.fn()} onDelete={onDelete} />);
    const deleteBtn = screen.getByTitle("Hapus");
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
