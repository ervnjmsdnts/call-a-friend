import { authRouter } from './routers/authRouter';
import { invitationRouter } from './routers/client/invitationRouter';
import { jobPostRouter } from './routers/client/jobPostRouter';
import { serviceRouter } from './routers/serviceRouter';
import { router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  clients: router({
    jobPost: jobPostRouter,
    invitation: invitationRouter,
  }),
  services: serviceRouter,
});
export type AppRouter = typeof appRouter;
