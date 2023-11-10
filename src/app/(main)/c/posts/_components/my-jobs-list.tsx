'use client';

import { trpc } from '@/app/_trpc/client';
import { Ghost, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MyJobsList() {
  const { data: posts, isLoading: postsLoading } =
    trpc.clients.jobPost.getUserJobs.useQuery();

  return (
    <div>
      {posts && posts.length > 0 ? (
        <div className='flex flex-col gap-3 w-full'>
          {posts.map((post) => (
            <Button
              key={post.id}
              variant='outline'
              asChild
              className='items-start flex-col py-8'>
              <Link href={`/c/posts/${post.id}`}>
                <h2 className='text-lg font-semibold'>{post.title}</h2>
                <p className='text-sm text-muted-foreground'>
                  {format(new Date(post.createdAt), 'PPp')}
                </p>
              </Link>
            </Button>
          ))}
        </div>
      ) : postsLoading ? (
        <div className='flex justify-center pt-12'>
          <Loader2 className='w-6 h-6 animate-spin' />
        </div>
      ) : (
        <div className='flex flex-col pt-12 gap-1 items-center'>
          <Ghost className='text-muted-foreground' />
          <p className='font-medium text-muted-foreground'>No posts</p>
        </div>
      )}
    </div>
  );
}
