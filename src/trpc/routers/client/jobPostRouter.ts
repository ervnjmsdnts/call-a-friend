import { db } from '@/db';
import { privateProcedure, router } from '@/trpc/trpc';
import { title } from 'process';
import { z } from 'zod';

export const jobPostRouter = router({
  postJob: privateProcedure
    .input(
      z.object({
        title: z.string(),
        location: z.string(),
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
    const jobs = db.jobPost.findMany({ where: { userId: ctx.user.id } });

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
        location: z.string(),
        description: z.string(),
        budgetRange: z.enum(['LOWBUDGET', 'MIDBUDGET', 'HIGHBUDGET']),
      }),
    )
    .mutation(async ({ input }) => {
      await db.jobPost.update({
        where: { id: input.postId },
        data: {
          budgetRange: input.budgetRange,
          description: input.description,
          title: input.title,
          location: input.location,
        },
      });
    }),
});
