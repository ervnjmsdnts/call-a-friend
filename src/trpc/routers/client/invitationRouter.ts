import { db } from '@/db';
import { publicProcedure, router } from '@/trpc/trpc';
import { z } from 'zod';

export const invitationRouter = router({
  inviteService: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        serviceId: z.string(),
        message: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.inviteService.create({
        data: {
          jobPostId: input.postId,
          serviceId: input.serviceId,
          message: input.message,
        },
      });
    }),

  cancelInvitation: publicProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ input }) => {
      await db.inviteService.update({
        where: { id: input.invitationId },
        data: { status: 'CANCELLED' },
      });
    }),

  deleteInvitation: publicProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ input }) => {
      await db.inviteService.delete({ where: { id: input.invitationId } });
    }),
});
