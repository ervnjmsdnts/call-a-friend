import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { TRPCError } from '@trpc/server';
import { format } from 'date-fns';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function MyApplications() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const user = session.user;

  if (!user || !user.id) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const applications = await db.applyJob.findMany({
    where: {
      service: { userId: user.id },
      status: { not: 'ACCEPTED' },
    },
    include: { post: true },
  });

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>My Applications</h2>
      <div className='flex flex-col gap-2'>
        {applications.map((app) => (
          <div key={app.id} className='p-4 rounded-lg border'>
            <div className='flex items-start gap-1 justify-between'>
              <p className='font-semibold text-lg'>
                Application for Post {app.post.title}
              </p>
              <Badge variant='secondary'>{app.status}</Badge>
            </div>
            <p className='text-muted-foreground mb-2 text-sm'>
              {format(new Date(app.createdAt), 'PPp')}
            </p>
            <div className='flex mt-4 justify-end'>
              <Button asChild variant='outline'>
                <Link href={`/s/my-applications/${app.id}`}>
                  View Application
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
