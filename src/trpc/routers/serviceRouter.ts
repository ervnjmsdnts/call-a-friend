import { z } from 'zod';
import { privateProcedure, publicProcedure, router } from '../trpc';
import { db } from '@/db';
import { TRPCError } from '@trpc/server';

export const serviceRouter = router({
  postService: privateProcedure
    .input(
      z.object({
        name: z.string(),
        category: z.enum(['CATERING', 'CONSTRUCTION', 'DEMOLITION']),
        barangay: z.string(),
        address: z.string(),
        description: z.string(),
        price: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await db.service.create({ data: { ...input, userId: ctx.user.id } });
    }),

  getUserServices: privateProcedure.query(async ({ ctx }) => {
    const services = await db.service.findMany({
      where: { userId: ctx.user.id },
      include: { user: true, ratings: true },
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
        price: z.number(),
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
          price: input.price,
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

  // Notify Client
  acceptInvitation: publicProcedure
    .input(
      z.object({
        invitationId: z.string(),
        serviceId: z.string(),
        postId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await db.$transaction(async (tx) => {
        await tx.inviteService.updateMany({
          where: {
            jobPostId: input.postId,
            serviceId: input.serviceId,
            status: 'PENDING',
            NOT: { id: input.invitationId },
          },
          data: { status: 'INVALID' },
        });

        await tx.inviteService.update({
          where: { id: input.invitationId },
          data: { status: 'ACCEPTED' },
        });

        const post = await tx.jobPost.update({
          where: { id: input.postId },
          data: {
            acceptedService: { connect: { id: input.serviceId } },
            status: 'ONGOING',
          },
        });

        const service = await tx.service.findFirst({
          where: { id: input.serviceId },
        });

        if (!service) return new TRPCError({ code: 'NOT_FOUND' });

        await tx.notification.create({
          data: {
            message: `The contractor of the service "${service.name}" has accepted your invitation on the job post "${post.title}".`,
            userId: post.userId,
          },
        });
      });
    }),

  // Notify Client
  rejectInvitation: publicProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ input }) => {
      return await db.$transaction(async (tx) => {
        const invitation = await tx.inviteService.update({
          where: { id: input.invitationId },
          data: { status: 'REJECTED' },
          include: {
            post: { select: { userId: true, title: true } },
            service: { select: { name: true } },
          },
        });

        await tx.notification.create({
          data: {
            message: `The contractor of the service "${invitation.service.name}" has rejected your invitation on the job post "${invitation.post.title}"`,
            userId: invitation.post.userId,
          },
        });
      });
    }),

  // Notify Client
  applyToJob: privateProcedure
    .input(
      z.object({
        serviceId: z.string(),
        postId: z.string(),
        message: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await db.$transaction(async (tx) => {
        const application = await tx.applyJob.create({
          data: {
            jobPostId: input.postId,
            serviceId: input.serviceId,
            message: input.message,
          },
          include: {
            service: { select: { name: true } },
            post: { select: { title: true, userId: true } },
          },
        });

        await tx.notification.create({
          data: {
            message: `The contractor of the service "${application.service.name}" has applied to your job post "${application.post.title}"`,
            userId: application.post.userId,
          },
        });
      });
    }),

  // Notify Client
  cancelApplication: publicProcedure
    .input(z.object({ applicationId: z.string() }))
    .mutation(async ({ input }) => {
      return await db.$transaction(async (tx) => {
        const application = await tx.applyJob.update({
          where: { id: input.applicationId },
          data: { status: 'CANCELLED' },
          include: {
            service: { select: { name: true } },
            post: { select: { title: true, userId: true } },
          },
        });

        await tx.notification.create({
          data: {
            message: `The contractor of the service "${application.service.name}" has cancelled their application for service for the job post "${application.post.title}"`,
            userId: application.post.userId,
          },
        });
      });
    }),
});
