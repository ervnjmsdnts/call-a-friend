'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AcceptInvitationButton({
  inviteId,
  postId,
  serviceId,
}: {
  inviteId: string;
  postId: string;
  serviceId: string;
}) {
  const router = useRouter();
  const { mutate: acceptInvite, isLoading } =
    trpc.services.acceptInvitation.useMutation({
      onSuccess: () => {
        router.refresh();
        router.back();
      },
    });

  return (
    <Button
      className='w-full'
      onClick={() =>
        acceptInvite({ invitationId: inviteId, postId, serviceId })
      }
      disabled={isLoading}>
      Accept
    </Button>
  );
}
