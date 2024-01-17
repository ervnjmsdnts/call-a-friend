import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { TRPCError } from '@trpc/server';
import { format } from 'date-fns';
import { Star } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const user = session.user;

  if (!user || !user.id) throw new TRPCError({ code: 'UNAUTHORIZED' });
  const ratings = await db.serviceRating.findMany({
    where: { userId: user.id },
    include: { jobPost: true },
  });

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>My Ratings</h2>
      <div className='flex flex-col gap-2'>
        {ratings.map((rate) => (
          <div key={rate.id} className='p-4 border rounded-lg w-full'>
            <div>
              <div className='flex justify-between gap-1 items-start'>
                <div>
                  <p className='font-semibold'>{rate.jobPost.title}</p>
                  <p className='text-sm'>
                    {rate.comment ? rate.comment : 'No Comment'}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {format(new Date(rate.createdAt), 'PPp')}
                  </p>
                </div>
                <div className='flex items-center justify-end gap-1'>
                  <Star className='fill-yellow-400 w-4 h-4 stroke-yellow-400' />
                  <p className='text-sm'>{rate.rating}</p>
                </div>
              </div>
            </div>
            <div className='flex justify-end w-full'>
              <Button asChild className='mt-4' variant='outline'>
                <Link href={`/c/posts/${rate.jobPostId}`}>View Post</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
