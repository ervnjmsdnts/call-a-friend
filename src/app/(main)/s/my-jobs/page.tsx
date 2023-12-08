import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { TRPCError } from '@trpc/server';
import { format } from 'date-fns';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function MyServiceJobs() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const user = session.user;

  if (!user || !user.id) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const jobs = await db.jobPost.findMany({
    where: {
      acceptedService: { userId: user.id },
    },
    include: { user: true },
  });

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>My Jobs</h2>
      <div className='flex flex-col gap-2'>
        {jobs.map((post) => (
          <div key={post.id} className='p-4 rounded-lg border'>
            <div className='flex items-start justify-between'>
              <p className='font-semibold text-lg'>{post.title}</p>
              <Badge variant='secondary'>{post.status}</Badge>
            </div>
            <p className='text-muted-foreground text-sm'>{post.user.name}</p>
            <p className='text-muted-foreground mb-2 text-sm'>
              {format(new Date(post.createdAt), 'PPp')}
            </p>
            <div className='flex justify-end'>
              <Button variant='outline'>
                <Link href={`/s/my-jobs/${post.id}`}>View Job Post</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
