import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { TRPCError } from '@trpc/server';
import { format } from 'date-fns';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function ServiceInvitation() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const user = session.user;

  if (!user || !user.id) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const invitations = await db.inviteService.findMany({
    where: { service: { user: { id: user.id } } },
    include: { post: true },
  });

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>Invitations</h2>
      <div className='flex flex-col gap-2'>
        {invitations.map((invite) => (
          <div key={invite.id} className='p-4 rounded-lg border'>
            <div className='flex items-start gap-1 justify-between'>
              <p className='font-semibold text-lg'>
                Invitation from Post {invite.post.title}
              </p>
              <Badge variant='secondary'>{invite.status}</Badge>
            </div>
            <p className='text-muted-foreground mb-2 text-sm'>
              {format(new Date(invite.createdAt), 'PPp')}
            </p>
            <div className='flex mt-4 justify-end'>
              {invite.status === 'PENDING' ? (
                <Button asChild variant='outline'>
                  <Link href={`/s/invitations/${invite.id}`}>
                    View Invitation
                  </Link>
                </Button>
              ) : null}
              {invite.status === 'ACCEPTED' ? (
                <Button asChild variant='outline'>
                  <Link href={`/s/my-jobs/${invite.jobPostId}`}>
                    View Job Post
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
