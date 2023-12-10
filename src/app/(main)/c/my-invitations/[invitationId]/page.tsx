import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CancelInvitationButton from '../_components/cancel-invitation-button';

export default async function ViewInvitation({
  params,
}: {
  params: { invitationId: string };
}) {
  const { invitationId } = params;

  const invitation = await db.inviteService.findFirst({
    where: { id: invitationId },
    include: { post: true, service: { include: { ratings: true } } },
  });

  if (!invitation || !invitation.id) {
    return notFound();
  }

  const post = invitation.post;
  const service = invitation.service;

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
          <div>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>{service.name}</h2>

              <div className='flex items-center justify-end gap-1'>
                <Star className='fill-yellow-400 w-4 h-4 stroke-yellow-400' />
                <p className='text-sm'>{maxRating}</p>
              </div>
            </div>
            <Badge variant='secondary'>{invitation.status}</Badge>
          </div>
          <Button variant='outline' className='w-full mt-4'>
            <Link href={`/s/discover/${post.id}`}>View Service</Link>
          </Button>
        </div>
        <div className='flex flex-col h-full'>
          <h2 className='text-lg font-semibold'>Job Post</h2>
          <p>{post.title}</p>
          {invitation.message ? (
            <div className='p-2 bg-gray-100 flex-grow mt-4 overflow-y-auto text-secondary-foreground rounded-md'>
              <h4 className='font-semibold mb-1'>My Message</h4>
              <p className='text-gray-400 text-sm h-0'>{invitation.message}</p>
            </div>
          ) : null}
        </div>
      </div>
      {invitation.status === 'PENDING' ? (
        <CancelInvitationButton inviteId={invitation.id} />
      ) : null}
    </div>
  );
}
