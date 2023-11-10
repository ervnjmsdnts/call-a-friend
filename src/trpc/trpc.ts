import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { TRPCError, initTRPC } from '@trpc/server';
import { cookies } from 'next/headers';

const t = initTRPC.create();

const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const user = session.user;

  if (!user || !user.id) throw new TRPCError({ code: 'UNAUTHORIZED' });

  return opts.next({ ctx: { user: { id: user.id } } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
