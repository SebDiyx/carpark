import { Type } from '@fastify/type-provider-typebox';
import { carpark, insertCarparkSchema, selectCarparkSchema } from '../schema';
import { eq } from 'drizzle-orm';

const root: Route = async (app) => {
    app.route({
        method: 'GET',
        url: '/carpark/:id',
        schema: {
            params: Type.Object({ id: Type.Number() }),
            response: {
                200: selectCarparkSchema,
            },
        },
        handler: async (args) => {
            const res = await app.db.query.carpark.findFirst({
                where: eq(carpark.id, args.params.id),
            });
            if (!res) {
                throw app.httpErrors.notFound('Carpark not found');
            }
            return res;
        },
    });

    app.route({
        method: 'GET',
        url: '/carparks',
        schema: {
            response: {
                200: Type.Array(selectCarparkSchema),
            },
        },
        handler: async () => {
            return app.db.query.carpark.findMany();
        },
    });

    app.route({
        method: 'POST',
        url: '/carpark',
        schema: {
            body: insertCarparkSchema,
            response: {
                200: selectCarparkSchema,
            },
        },
        handler: async (args) => {
            const returnShape = { id: carpark.id, name: carpark.name };

            if (!args.body.id) {
                // Create
                const res = await app.db
                    .insert(carpark)
                    .values(args.body)
                    .returning(returnShape);
                return res[0];
            } else {
                // Update
                const res = await app.db
                    .update(carpark)
                    .set(args.body)
                    .where(eq(carpark.id, args.body.id))
                    .returning(returnShape);

                if (res.length === 0) {
                    throw app.httpErrors.notFound('Carpark not found');
                }

                return res[0];
            }
        },
    });
};

export default root;
