import { db } from '@/db';
import { publicProcedure, router } from '@/trpc/trpc';
import { z } from 'zod';

export const invitationRouter = router({
  // Notify Provider
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

  // Notify Provider
  cancelInvitation: publicProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ input }) => {
      return await db.$transaction(async (tx) => {
        const invitation = await tx.inviteService.update({
          where: { id: input.invitationId },
          data: { status: 'CANCELLED' },
          include: {
            service: { select: { name: true, userId: true } },
            post: { select: { title: true } },
          },
        });

        await tx.notification.create({
          data: {
            message: `The client for the job post ${invitation.post.title} has cancelled their invitation on your service ${invitation.service.name}`,
            userId: invitation.service.userId,
          },
        });
      });
    }),

  deleteInvitation: publicProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ input }) => {
      await db.inviteService.delete({ where: { id: input.invitationId } });
    }),
});
