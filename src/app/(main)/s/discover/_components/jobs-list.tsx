'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Ghost, Loader2 } from 'lucide-react';

export default function JobsList() {
  const { data: posts, isLoading } = trpc.clients.jobPost.getAll.useQuery();

  return (
    <div>
      {posts && posts.length > 0 ? (
        <div className='flex flex-col gap-3 mt-4 w-full'>
          {posts.map((post) => (
            <div key={post.id} className='border rounded-lg p-4'>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-lg font-semibold'>{post.title}</h2>
                  <p className='text-sm text-muted-foreground'>
                    {post.user.name}
                  </p>
                </div>
                {post.description ? (
                  <p className='text-sm'>{post.description}</p>
                ) : null}

                <Button className='w-full'>Apply Now</Button>
              </div>
            </div>
          ))}
        </div>
      ) : isLoading ? (
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
