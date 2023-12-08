import { Button } from '@/components/ui/button';
import { getBudgetRange } from '@/lib/utils';
import { JobPost } from '@prisma/client';
import { format } from 'date-fns';

export default function JobService({ post }: { post: JobPost }) {
  return (
    <div className='flex flex-col h-full'>
      <div className='space-y-4 flex-1'>
        <div>
          <div className='flex justify-between gap-2'>
            <h2 className='text-2xl font-bold'>{post.title}</h2>
          </div>
          <p className='text-sm text-muted-foreground'>
            Posted on {format(new Date(post.createdAt), 'PP')}
          </p>
        </div>
        <p>{post.description}</p>

        <div>
          <h2 className='text-lg font-semibold'>Location</h2>
          <p>
            {post.address}, Brgy. {post.barangay}
          </p>
        </div>

        <div>
          <h2 className='text-lg font-semibold'>Budget Range</h2>
          <p>{getBudgetRange(post.budgetRange)}</p>
        </div>
      </div>
      <Button>Apply</Button>
    </div>
  );
}
