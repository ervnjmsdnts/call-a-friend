import { db } from '@/db';
import { privateProcedure, router } from '../trpc';

export const notificationRouter = router({
  getUserNotifications: privateProcedure.query(async ({ ctx }) => {
    const notifications = await db.notification.findMany({
      where: { userId: ctx.user.id },
    });

    return notifications;
  }),

  readAllNotificationsOfUser: privateProcedure.mutation(async ({ ctx }) => {
    await db.notification.updateMany({
      where: { userId: ctx.user.id },
      data: { isRead: false },
    });
  }),
});
