import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const familyMembers = pgTable("family_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  emoji: text("emoji"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const mealSlots = pgTable("meal_slots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  mealSlotId: integer("meal_slot_id")
    .notNull()
    .references(() => mealSlots.id),
  menuName: text("menu_name").notNull(),
  restaurantName: text("restaurant_name"),
  assignedMembers: jsonb("assigned_members").$type<string[]>(),
  activities: jsonb("activities").$type<string[]>(),
  notes: text("notes"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});
