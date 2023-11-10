import { authRouter } from './routers/authRouter';
import { jobPostRouter } from './routers/client/jobPostRouter';
import { serviceRouter } from './routers/serviceRouter';
import { router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  clients: router({
    jobPost: jobPostRouter,
  }),
  services: serviceRouter,
});
export type AppRouter = typeof appRouter;
