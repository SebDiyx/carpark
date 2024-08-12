import type { InferSelectModel } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';

export const carpark = sqliteTable('carpark', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),

    // TODO: Add company/location
});

export type Carpark = InferSelectModel<typeof carpark>;

export const insertCarparkSchema = createInsertSchema(carpark);
export const selectCarparkSchema = createSelectSchema(carpark);
