import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  date,
} from "drizzle-orm/mysql-core";

export const enquiries = mysqlTable("enquiries", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  eventDate: date("event_date", { mode: "string" }).notNull(),
  venue: varchar("venue", { length: 200 }).notNull(),
  service: varchar("service", { length: 100 }).notNull(),
  packageName: varchar("package_name", { length: 100 }),
  style: varchar("style", { length: 100 }),
  coverage: varchar("coverage", { length: 100 }),
  message: text("message"),
  status: mysqlEnum("status", ["new", "in-progress", "booked", "closed"]).notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type InsertEnquiry = typeof enquiries.$inferInsert;
