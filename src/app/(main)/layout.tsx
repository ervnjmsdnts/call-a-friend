import AppNavbar from '@/components/app-navbar';
import { db } from '@/db';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function MainLayout({ children }: PropsWithChildren) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.id) return redirect('/auth');

  const dbUser = await db.user.findUnique({ where: { id: user.id } });

  if (!dbUser || !dbUser.id || !dbUser.name) return redirect('/auth');

  if (!dbUser.role) return redirect('/auth/assign-role');

  return (
    <div className='flex flex-col h-full'>
      <AppNavbar userRole={dbUser.role} userName={dbUser.name} />
      <div className='p-4 h-full'>{children}</div>
    </div>
  );
}
