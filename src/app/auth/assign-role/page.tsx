import { db } from '@/db';
import { redirect } from 'next/navigation';
import AssignRole from '../_components/assign-role';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function AssignRolePage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    console.log({ session });
    return redirect('/auth');
  }

  const user = session.user;

  if (!user || !user.id || error) {
    console.log({ user, error });
    return redirect('/auth');
  }

  const dbUser = await db.user.findFirst({ where: { id: user.id } });

  if (!dbUser || !dbUser.id) {
    console.log({ dbUser });
    return redirect('/auth');
  }

  if (dbUser.role === 'SERVICE') return redirect('/s');
  if (dbUser.role === 'CLIENT') return redirect('/c');

  return <AssignRole />;
}
