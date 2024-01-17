import { Badge } from '@/components/ui/badge';
import { toPhp } from '@/lib/utils';
import { JobPost, ServiceRating } from '@prisma/client';
import { format } from 'date-fns';
import { Star } from 'lucide-react';

export default function Post({
  post,
  serviceRating,
}: {
  post: JobPost;
  serviceRating: ServiceRating | null;
}) {
  console.log(serviceRating);
  return (
    <div className='space-y-4 flex-1'>
      <div>
        <div className='flex justify-between gap-2'>
          <h2 className='text-2xl font-bold'>{post.title}</h2>
        </div>
        <p className='text-sm text-muted-foreground'>
          Posted on {format(new Date(post.createdAt), 'PP')}
        </p>
        <Badge variant='outline'>{post.status}</Badge>
      </div>
      <p>{post.contactNumber}</p>
      <p>{post.description}</p>
      <div>
        <h2 className='text-lg font-semibold'>Location</h2>
        <p>
          {post.address}, Brgy. {post.barangay}
        </p>
      </div>
      <div>
        <h2 className='text-lg font-semibold'>Price</h2>
        <p>{toPhp(post.price)}</p>
      </div>
      {serviceRating && serviceRating.id ? (
        <div>
          <h2 className='text-lg font-semibold'>Client&apos;s Rating</h2>
          <div className='p-4 border rounded-lg w-full'>
            <div className='flex justify-between gap-1 items-start'>
              <div>
                <p className='text-sm'>
                  {serviceRating.comment ? serviceRating.comment : 'No Comment'}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {format(new Date(serviceRating.createdAt), 'PPp')}
                </p>
              </div>
              <div className='flex items-center justify-end gap-1'>
                <Star className='fill-yellow-400 w-4 h-4 stroke-yellow-400' />
                <p className='text-sm'>{serviceRating.rating}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
