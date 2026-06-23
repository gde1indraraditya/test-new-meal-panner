export interface FamilyMember {
  id: number;
  name: string;
  code: string;
  emoji: string | null;
  isActive: boolean;
}

export interface MealSlot {
  id: number;
  name: string;
  icon: string | null;
  sortOrder: number;
}

export interface Meal {
  id: number;
  date: string;
  mealSlotId: number;
  menuName: string;
  restaurantName: string | null;
  assignedMembers: string[] | null;
  activities: string[] | null;
  notes: string | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
}
