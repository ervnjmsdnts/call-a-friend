'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CancelInvitationButton({
  inviteId,
}: {
  inviteId: string;
}) {
  const router = useRouter();
  const { mutate: cancelInvite, isLoading } =
    trpc.clients.invitation.cancelInvitation.useMutation({
      onSuccess: () => router.refresh(),
    });

  return (
    <Button
      variant='outline'
      onClick={() => cancelInvite({ invitationId: inviteId })}
      disabled={isLoading}>
      Cancel
    </Button>
  );
}
