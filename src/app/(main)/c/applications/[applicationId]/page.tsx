import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AcceptButton from '../_components/accept-button';
import RejectButton from '../_components/reject-button';

export default async function SpecificApplication({
  params,
}: {
  params: { applicationId: string };
}) {
  const { applicationId } = params;

  const application = await db.applyJob.findFirst({
    where: { id: applicationId },
    include: { post: true, service: { include: { ratings: true } } },
  });

  if (!application || !application.id) {
    return notFound();
  }

  const post = application.post;
  const service = application.service;

  const totalRating = service.ratings.reduce(
    (sum, rating) => sum + rating.rating,
    0,
  );
  const averageRating = totalRating / service.ratings.length;
  const maxRating = Math.min(averageRating, 5) || 0;

  return (
    <div className='flex flex-col h-full gap-4'>
      <div className='flex-1 flex flex-col gap-6 h-full'>
        <div className='p-4 border rounded-lg'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>{post.title}</h2>
            <Badge variant='secondary'>{application.status}</Badge>
          </div>
          <Button
            variant='outline'
            disabled={post.status !== 'PENDING'}
            className='w-full mt-4'>
            <Link href={`/c/posts/${post.id}`}>View Job Post</Link>
          </Button>
        </div>
        <div className='flex flex-col h-full'>
          <div className='flex justify-between items-center'>
            <div>
              <div className='flex gap-1 items-center'>
                <h2 className='text-lg font-semibold'>Service Provided</h2>
                <div className='flex items-center justify-end gap-1'>
                  <Star className='fill-yellow-400 w-4 h-4 stroke-yellow-400' />
                  <p className='text-sm'>{maxRating}</p>
                </div>
              </div>
              <p>{service.name}</p>
            </div>
            <Button asChild>
              <Link href={`/c/discover/${service.id}`}>View Service</Link>
            </Button>
          </div>
          {application.message ? (
            <div className='p-2 bg-gray-100 flex-grow mt-4 overflow-y-auto text-secondary-foreground rounded-md'>
              <h4 className='font-semibold mb-1'>Message</h4>
              <p className='text-gray-400 text-sm h-0'>{application.message}</p>
            </div>
          ) : null}
        </div>
        {application.status === 'PENDING' ? (
          <div className='flex gap-2 mt-2'>
            <RejectButton applicationId={application.id} />
            <AcceptButton
              applicationId={application.id}
              serviceId={service.id}
              postId={post.id}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
