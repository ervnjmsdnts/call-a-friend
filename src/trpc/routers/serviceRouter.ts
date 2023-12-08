import { z } from 'zod';
import { privateProcedure, publicProcedure, router } from '../trpc';
import { db } from '@/db';

export const serviceRouter = router({
  postService: privateProcedure
    .input(
      z.object({
        name: z.string(),
        category: z.enum(['CATERING', 'CONSTRUCTION', 'DEMOLITION']),
        barangay: z.string(),
        address: z.string(),
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
        barangay: z.string(),
        address: z.string(),
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
          barangay: input.barangay,
          address: input.address,
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

  acceptInvitation: publicProcedure
    .input(
      z.object({
        invitationId: z.string(),
        serviceId: z.string(),
        postId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.$transaction([
        db.inviteService.updateMany({
          where: {
            jobPostId: input.postId,
            serviceId: input.serviceId,
            NOT: { id: input.invitationId },
          },
          data: { status: 'INVALID' },
        }),
        db.inviteService.update({
          where: { id: input.invitationId },
          data: { status: 'ACCEPTED' },
        }),
        db.jobPost.update({
          where: { id: input.postId },
          data: {
            acceptedService: { connect: { id: input.serviceId } },
            status: 'ONGOING',
          },
        }),
      ]);
    }),

  rejectInvitation: publicProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ input }) => {
      await db.inviteService.update({
        where: { id: input.invitationId },
        data: { status: 'REJECTED' },
      });
    }),
});
