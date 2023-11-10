import { z } from 'zod';
import { privateProcedure, publicProcedure, router } from '../trpc';
import { db } from '@/db';
import { TRPCError } from '@trpc/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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
      const supabase = createRouteHandlerClient({ cookies });
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
      const supabase = createRouteHandlerClient({ cookies });
      const { error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error)
        throw new TRPCError({ code: 'NOT_FOUND', message: error.message });
    }),

  assignRole: privateProcedure
    .input(z.object({ role: z.enum(['SERVICE', 'CLIENT']) }))
    .mutation(async ({ ctx, input }) => {
      await db.user.update({
        where: { id: ctx.user.id },
        data: { role: input.role },
      });
    }),
});
