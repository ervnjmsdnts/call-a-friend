import {
  createRouteHandlerClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const createServerClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient({
    cookies: () => cookieStore,
  });
});

export const createRouterClient = cache(() => {
  const cookieStore = cookies();
  createRouteHandlerClient({
    cookies: () => cookieStore,
  });
});
