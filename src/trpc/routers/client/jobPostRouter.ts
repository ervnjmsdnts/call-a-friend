import { db } from '@/db';
import { jobCategories } from '@/lib/utils';
import { privateProcedure, publicProcedure, router } from '@/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const jobPostRouter = router({
  postJob: privateProcedure
    .input(
      z.object({
        title: z.string(),
        barangay: z.string(),
        address: z.string(),
        category: z.enum(jobCategories),
        description: z.string(),
        contactNumber: z.string(),
        price: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await db.jobPost.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });
    }),
  getUserJobs: privateProcedure.query(async ({ ctx }) => {
    const jobs = db.jobPost.findMany({
      where: { userId: ctx.user.id, isActive: true },
    });

    return jobs;
  }),

  deleteJobPost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input }) => {
      await db.jobPost.update({
        where: { id: input.postId },
        data: { isActive: false },
      });
    }),

  updateJobPost: privateProcedure
    .input(
      z.object({
        postId: z.string(),
        title: z.string(),
        barangay: z.string(),
        category: z.enum(jobCategories),
        address: z.string(),
        description: z.string(),
        contactNumber: z.string(),
        price: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.jobPost.update({
        where: { id: input.postId },
        data: {
          category: input.category,
          price: input.price,
          description: input.description,
          title: input.title,
          contactNumber: input.contactNumber,
          barangay: input.barangay,
          address: input.address,
        },
      });
    }),

  getAll: privateProcedure.query(async () => {
    const posts = await db.jobPost.findMany({
      where: { status: 'PENDING', isActive: true },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    return posts;
  }),

  finishJob: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        status: z.enum(['TERMINATED', 'DONE', 'ONGOING', 'PENDING']),
      }),
    )
    .mutation(async ({ input }) => {
      // Notify Service
      return await db.$transaction(async (tx) => {
        const post = await tx.jobPost.update({
          where: { id: input.postId },
          data: { status: input.status },
          include: { acceptedService: { select: { userId: true } } },
        });

        if (!post.acceptedService)
          return new TRPCError({ code: 'BAD_REQUEST' });

        await tx.notification.create({
          data: {
            message: `The client of the job "${post.title}" has declared your service to be ${post.status}`,
            userId: post.acceptedService.userId,
          },
        });
      });
    }),

  rateService: privateProcedure
    .input(
      z.object({
        rating: z.number(),
        comment: z.string().optional(),
        serviceId: z.string(),
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.$transaction(async (tx) => {
        const rating = await tx.serviceRating.create({
          data: {
            rating: input.rating,
            comment: input.comment,
            jobPostId: input.postId,
            serviceId: input.serviceId,
            userId: ctx.user.id,
          },
          include: {
            service: { select: { userId: true, name: true } },
            jobPost: { select: { title: true } },
          },
        });

        await tx.notification.create({
          data: {
            message: `The client for the job "${rating.jobPost.title}" has rated your service "${rating.service.name}" with ${rating.rating} stars`,
            userId: rating.service.userId,
          },
        });
      });
    }),

  rejectApplication: publicProcedure
    .input(z.object({ applicationId: z.string() }))
    .mutation(async ({ input }) => {
      return await db.$transaction(async (tx) => {
        const application = await tx.applyJob.update({
          where: { id: input.applicationId },
          data: { status: 'REJECTED' },
          include: {
            post: { select: { title: true } },
            service: { select: { name: true, userId: true } },
          },
        });

        await tx.notification.create({
          data: {
            message: `The client for the job post "${application.post.title}" has rejected your application on the service "${application.service.name}"`,
            userId: application.service.userId,
          },
        });
      });
    }),

  acceptApplication: publicProcedure
    .input(
      z.object({
        applicationId: z.string(),
        serviceId: z.string(),
        postId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await db.$transaction(async (tx) => {
        await tx.applyJob.updateMany({
          where: {
            jobPostId: input.postId,
            serviceId: input.serviceId,
            status: 'PENDING',
            NOT: { id: input.applicationId },
          },
          data: { status: 'INVALID' },
        });

        await tx.applyJob.update({
          where: { id: input.applicationId },
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
            message: `The client for the job post "${post.title}" has accepted your application on the service "${service.name}".`,
            userId: service.userId,
          },
        });
      });
    }),
});
