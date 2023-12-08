import { db } from '@/db';
import { privateProcedure, publicProcedure, router } from '@/trpc/trpc';
import { z } from 'zod';

export const jobPostRouter = router({
  postJob: privateProcedure
    .input(
      z.object({
        title: z.string(),
        barangay: z.string(),
        address: z.string(),
        category: z.enum(['CATERING', 'CONSTRUCTION', 'DEMOLITION']),
        description: z.string(),
        budgetRange: z.enum(['LOWBUDGET', 'MIDBUDGET', 'HIGHBUDGET']),
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
      where: { userId: ctx.user.id },
    });

    return jobs;
  }),

  deleteJobPost: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input }) => {
      await db.jobPost.delete({ where: { id: input.postId } });
    }),

  updateJobPost: privateProcedure
    .input(
      z.object({
        postId: z.string(),
        title: z.string(),
        barangay: z.string(),
        category: z.enum(['CATERING', 'CONSTRUCTION', 'DEMOLITION']),
        address: z.string(),
        description: z.string(),
        budgetRange: z.enum(['LOWBUDGET', 'MIDBUDGET', 'HIGHBUDGET']),
      }),
    )
    .mutation(async ({ input }) => {
      await db.jobPost.update({
        where: { id: input.postId },
        data: {
          category: input.category,
          budgetRange: input.budgetRange,
          description: input.description,
          title: input.title,
          barangay: input.barangay,
          address: input.address,
        },
      });
    }),

  getAll: privateProcedure.query(async () => {
    const posts = await db.jobPost.findMany({
      where: { status: 'PENDING' },
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
      await db.jobPost.update({
        where: { id: input.postId },
        data: { status: input.status },
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
      await db.serviceRating.create({
        data: {
          rating: input.rating,
          comment: input.comment,
          jobPostId: input.postId,
          serviceId: input.serviceId,
          userId: ctx.user.id,
        },
      });
    }),
});
