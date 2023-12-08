'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function RejectInvitationButton({
  inviteId,
}: {
  inviteId: string;
}) {
  const router = useRouter();
  const { mutate: rejectInvite, isLoading } =
    trpc.services.rejectInvitation.useMutation({
      onSuccess: () => router.back(),
    });

  return (
    <Button
      variant='outline'
      className='w-full'
      onClick={() => rejectInvite({ invitationId: inviteId })}
      disabled={isLoading}>
      Reject
    </Button>
  );
}
