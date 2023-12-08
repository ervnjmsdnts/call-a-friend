import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { TRPCError } from '@trpc/server';
import { format } from 'date-fns';
import { cookies } from 'next/headers';
import CancelInvitationButton from './_components/cancel-invitation-button';
import DeleteInvitationButton from './_components/delete-invitation-button';
import Link from 'next/link';

export default async function MyInvitations() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const user = session.user;

  if (!user || !user.id) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const invitations = await db.inviteService.findMany({
    where: { post: { userId: user.id } },
    include: { service: true },
  });

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>My Invitations</h2>
      <div className='flex flex-col gap-2'>
        {invitations.map((invite) => (
          <div key={invite.id} className='p-4 rounded-lg border'>
            <div className='flex items-start justify-between'>
              <p className='font-semibold text-lg'>
                Invitation for {invite.service.name}
              </p>
              <Badge variant='secondary'>{invite.status}</Badge>
            </div>
            <p className='text-muted-foreground mb-2 text-sm'>
              {format(new Date(invite.createdAt), 'PPp')}
            </p>
            <div className='flex justify-end'>
              {invite.status === 'PENDING' ? (
                <CancelInvitationButton inviteId={invite.id} />
              ) : invite.status === 'CANCELLED' ||
                invite.status === 'INVALID' ||
                invite.status === 'REJECTED' ? (
                <DeleteInvitationButton inviteId={invite.id} />
              ) : (
                <Button variant='outline'>
                  <Link href={`/c/posts/${invite.jobPostId}`}>
                    View Job Post
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
