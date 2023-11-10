import {
  createRouteHandlerClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const supabaseServer = createServerComponentClient({ cookies });
export const supabaseRouter = createRouteHandlerClient({ cookies });
