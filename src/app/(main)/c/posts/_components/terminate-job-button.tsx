'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function TerminateJobButton({ postId }: { postId: string }) {
  const router = useRouter();
  const { mutate: terminateJob, isLoading } =
    trpc.clients.jobPost.finishJob.useMutation({
      onSuccess: () => router.refresh(),
    });
  return (
    <Button
      variant='secondary'
      onClick={() => {
        terminateJob({ status: 'TERMINATED', postId });
      }}
      disabled={isLoading}
      className='w-full'>
      Terminate Job
    </Button>
  );
}
