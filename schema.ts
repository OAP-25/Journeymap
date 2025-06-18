import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping existing schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Journey maps schema
export const journeyMaps = pgTable("journey_maps", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  style: text("style").default("marker"),
  complexity: text("complexity").default("simple"),
  elements: jsonb("elements").notNull(),
  connections: jsonb("connections").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: integer("user_id").references(() => users.id),
});

export const insertJourneyMapSchema = createInsertSchema(journeyMaps).pick({
  title: true,
  description: true,
  style: true,
  complexity: true,
  elements: true,
  connections: true,
  userId: true,
});

// Element schema for type checking
export const elementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  width: z.number(),
  height: z.number(),
  color: z.string().optional(),
  category: z.string().optional(),
  duration: z.number().optional(),
  durationUnit: z.string().optional(),
  notes: z.string().optional(),
});

// Connection schema for type checking
export const connectionSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  targetId: z.string(),
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertJourneyMap = z.infer<typeof insertJourneyMapSchema>;
export type JourneyMap = typeof journeyMaps.$inferSelect;

export type Element = z.infer<typeof elementSchema>;
export type Connection = z.infer<typeof connectionSchema>;
