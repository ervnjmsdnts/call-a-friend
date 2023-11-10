import { z } from 'zod';
import { privateProcedure, router } from '../trpc';
import { db } from '@/db';

export const serviceRouter = router({
  postService: privateProcedure
    .input(
      z.object({
        name: z.string(),
        category: z.enum(['CATERING', 'CONSTRUCTION', 'DEMOLITION']),
        location: z.string(),
        description: z.string(),
        priceRange: z.enum(['LOWBUDGET', 'MIDBUDGET', 'HIGHBUDGET']),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await db.service.create({ data: { ...input, userId: ctx.user.id } });
    }),

  getUserServices: privateProcedure.query(async ({ ctx }) => {
    const services = await db.service.findMany({
      where: { userId: ctx.user.id },
    });

    return services;
  }),

  updateService: privateProcedure
    .input(
      z.object({
        serviceId: z.string(),
        name: z.string(),
        category: z.enum(['CATERING', 'CONSTRUCTION', 'DEMOLITION']),
        location: z.string(),
        description: z.string(),
        priceRange: z.enum(['LOWBUDGET', 'MIDBUDGET', 'HIGHBUDGET']),
      }),
    )
    .mutation(async ({ input }) => {
      await db.service.update({
        where: { id: input.serviceId },
        data: {
          category: input.category,
          description: input.description,
          location: input.location,
          name: input.name,
          priceRange: input.priceRange,
        },
      });
    }),

  deleteService: privateProcedure
    .input(z.object({ serviceId: z.string() }))
    .mutation(async ({ input }) => {
      await db.service.delete({ where: { id: input.serviceId } });
    }),

  getAll: privateProcedure.query(async () => {
    const services = await db.service.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    return services;
  }),
});
