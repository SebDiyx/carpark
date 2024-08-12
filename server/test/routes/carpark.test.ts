import { test, describe, expect } from 'vitest';
import { build } from '../helper';
import { carpark } from '../../src/schema';
import { eq } from 'drizzle-orm';

describe('carpark', () => {
    test('GET /carparks', async () => {
        const app = await build();

        // Test that the endpoint returns an empty array when there are no carparks
        const res1 = await app.inject({ url: '/carparks' });
        expect(res1.json()).toEqual([]);

        // Test that the endpoint returns the correct carparks after inserting one
        await app.db.insert(carpark).values({
            name: 'Test',
        });
        const res2 = await app.inject({ url: '/carparks' });
        expect(res2.json()).toEqual([
            {
                id: 1,
                name: 'Test',
            },
        ]);

        // Test deleting a carpark returns an empty array
        await app.db.delete(carpark).where(eq(carpark.id, 1));
        const res3 = await app.inject({ url: '/carparks' });
        expect(res3.json()).toEqual([]);
    });

    test('GET /carpark/:id', async () => {
        const app = await build();

        // Test that the endpoint errors when there are no carparks with the given id
        const res1 = await app.inject({ url: '/carpark/1' });
        expect(res1.json()).toEqual({
            statusCode: 404,
            error: 'Not Found',
            message: 'Carpark not found',
        });

        // Test that the endpoint returns the correct carpark after inserting one
        await app.db.insert(carpark).values({
            name: 'Test',
        });
        const res2 = await app.inject({ url: '/carpark/1' });

        expect(res2.json()).toEqual({
            id: 1,
            name: 'Test',
        });

        // Test deleting a carpark returns an empty array
        await app.db.delete(carpark).where(eq(carpark.id, 1));
        const res3 = await app.inject({ url: '/carpark/1' });
        expect(res3.json()).toEqual({
            statusCode: 404,
            error: 'Not Found',
            message: 'Carpark not found',
        });
    });

    test('POST /carpark', async () => {
        const app = await build();

        // Create a carpark
        const res1 = await app.inject({
            method: 'POST',
            url: '/carpark',
            body: { name: 'A1' },
        });
        expect(res1.statusCode).toBe(200);
        expect(res1.json()).toEqual({
            id: 1,
            name: 'A1',
        });

        // Update a carpark
        const res2 = await app.inject({
            method: 'POST',
            url: '/carpark',
            body: { id: 1, name: 'A2' },
        });

        expect(res2.statusCode).toBe(200);
        expect(res2.json()).toEqual({
            id: 1,
            name: 'A2',
        });

        // Can't update an non-existent carpark
        const res3 = await app.inject({
            method: 'POST',
            url: '/carpark',
            body: { id: 2, name: 'A3' },
        });
        expect(res3.statusCode).toBe(404);
    });
});
