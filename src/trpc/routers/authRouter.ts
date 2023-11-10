import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '@/app/db';
import { supabase } from '@/lib/supabase';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
  createAccount: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: error.message });
      }

      if (!user || !user.id || !user.email) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      await db.user.create({
        data: { id: user.id, email: user.email, name: input.name },
      });
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error)
        throw new TRPCError({ code: 'NOT_FOUND', message: error.message });
    }),
});
