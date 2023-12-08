import { getBudgetRange } from '@/lib/utils';
import { InviteService, JobPost, Service, User } from '@prisma/client';
import { format } from 'date-fns';
import RejectInvitationButton from './reject-invitation-button';
import AcceptInvitationButton from './accept-invitation-button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

export default function Invite({
  invitation,
}: {
  invitation: InviteService & {
    post: JobPost & { user: User; acceptedService: Service | null };
  };
}) {
  const post = invitation.post;
  return (
    <div className='flex flex-col h-full'>
      <div className='space-y-4 flex-1'>
        <div>
          <div className='flex items-start justify-between'>
            <h2 className='text-2xl font-bold'>{post.title}</h2>
            <Badge variant='secondary'>{invitation.status}</Badge>
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
      {!post.acceptedService ? (
        <div className='flex gap-2 w-full'>
          <RejectInvitationButton inviteId={invitation.id} />
          <AcceptInvitationButton
            inviteId={invitation.id}
            serviceId={invitation.serviceId}
            postId={invitation.jobPostId}
          />
        </div>
      ) : null}
    </div>
  );
}
