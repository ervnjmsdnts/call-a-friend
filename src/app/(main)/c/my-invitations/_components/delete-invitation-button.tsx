'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DeleteInvitationButton({
  inviteId,
}: {
  inviteId: string;
}) {
  const router = useRouter();
  const { mutate: deleteInvite, isLoading } =
    trpc.clients.invitation.deleteInvitation.useMutation({
      onSuccess: () => router.refresh(),
    });

  return (
    <Button
      variant='destructive'
      onClick={() => deleteInvite({ invitationId: inviteId })}
      disabled={isLoading}>
      Delete
    </Button>
  );
}
