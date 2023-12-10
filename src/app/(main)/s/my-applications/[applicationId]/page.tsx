import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { notFound } from 'next/navigation';
import CancelApplication from '../_components/cancel-application';
import Link from 'next/link';

export default async function ViewApplication({
  params,
}: {
  params: { applicationId: string };
}) {
  const { applicationId } = params;

  const application = await db.applyJob.findFirst({
    where: { id: applicationId },
    include: { post: true, service: true },
  });

  if (!application || !application.id) {
    return notFound();
  }

  const post = application.post;
  const service = application.service;

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
            <Link href={`/s/discover/${post.id}`}>View Job Post</Link>
          </Button>
        </div>
        <div className='flex flex-col h-full'>
          <h2 className='text-lg font-semibold'>Service Provided</h2>
          <p>{service.name}</p>
          {application.message ? (
            <div className='p-2 bg-gray-100 flex-grow mt-4 overflow-y-auto text-secondary-foreground rounded-md'>
              <h4 className='font-semibold mb-1'>My Message</h4>
              <p className='text-gray-400 text-sm h-0'>{application.message}</p>
            </div>
          ) : null}
        </div>
      </div>
      {application.status === 'PENDING' ? (
        <CancelApplication applicationId={application.id} />
      ) : null}
    </div>
  );
}
