import { db } from '@/db';
import { redirect } from 'next/navigation';
import AssignRole from '../_components/assign-role';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function AssignRolePage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    return redirect('/auth');
  }

  const user = session.user;

  if (!user || !user.id || error) {
    return redirect('/auth');
  }

  const dbUser = await db.user.findFirst({ where: { id: user.id } });

  if (!dbUser || !dbUser.id) {
    return redirect('/auth');
  }

  if (dbUser.role === 'SERVICE') return redirect('/s/services');
  if (dbUser.role === 'CLIENT') return redirect('/c/posts');

  return <AssignRole />;
}
