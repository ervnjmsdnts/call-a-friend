'use client';

import { getBudgetRange } from '@/lib/utils';
import { JobPost } from '@prisma/client';
import { format } from 'date-fns';
import ActionDropdown from './action-dropdown';

export default function Post({ post }: { post: JobPost }) {
  return (
    <div className='space-y-4'>
      <div>
        <div className='flex justify-between'>
          <h2 className='text-2xl font-bold'>{post.title}</h2>
          <ActionDropdown post={post} />
        </div>
        <p className='text-sm text-muted-foreground'>
          Posted on {format(new Date(post.createdAt), 'PP')}
        </p>
      </div>
      <p>{post.description}</p>

      <div>
        <h2 className='text-lg font-semibold'>Location</h2>
        <p>{post.location}</p>
      </div>

      <div>
        <h2 className='text-lg font-semibold'>Budget Range</h2>
        <p>{getBudgetRange(post.budgetRange)}</p>
      </div>
    </div>
  );
}
