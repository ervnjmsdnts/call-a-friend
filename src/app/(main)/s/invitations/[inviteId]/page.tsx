import { db } from '@/db';
import { notFound } from 'next/navigation';
import Invite from '../_components/invite';

export default async function ViewServiceInvitation({
  params,
}: {
  params: { inviteId: string };
}) {
  const { inviteId } = params;

  const invitation = await db.inviteService.findFirst({
    where: { id: inviteId },
    include: {
      post: { include: { user: true, acceptedService: true } },
    },
  });

  if (!invitation || !invitation.id) return notFound();

  return <Invite invitation={invitation} />;
}
