import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const authRouter = router({
  createAccount: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {}),
});
