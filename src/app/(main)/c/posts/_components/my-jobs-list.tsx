'use client';

import { trpc } from '@/app/_trpc/client';
import { Ghost, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function MyJobsList() {
  const { data: posts, isLoading: postsLoading } =
    trpc.clients.jobPost.getUserJobs.useQuery();

  return (
    <div>
      {posts && posts.length > 0 ? (
        <div className='flex flex-col gap-3 w-full'>
          {posts.map((post) => (
            <div key={post.id} className='p-4 rounded-lg border'>
              <div className='flex items-start justify-between'>
                <p className='font-semibold text-lg'>{post.title}</p>
                <Badge variant='secondary'>{post.status}</Badge>
              </div>
              <p className='text-muted-foreground mb-2 text-sm'>
                {format(new Date(post.createdAt), 'PPp')}
              </p>
              <div className='flex justify-end'>
                <Button variant='outline'>
                  <Link href={`/c/posts/${post.id}`}>View Job Post</Link>
                </Button>
              </div>
            </div>
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
