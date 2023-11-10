import { authRouter } from './routers/authRouter';
import { jobPostRouter } from './routers/client/jobPostRouter';
import { router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  clients: router({
    jobPost: jobPostRouter,
  }),
});
export type AppRouter = typeof appRouter;
