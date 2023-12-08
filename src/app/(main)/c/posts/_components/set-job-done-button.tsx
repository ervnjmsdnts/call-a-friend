'use client';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function SetJobDoneButton({ postId }: { postId: string }) {
  const router = useRouter();
  const { mutate: jobDone, isLoading } =
    trpc.clients.jobPost.finishJob.useMutation({
      onSuccess: () => router.refresh(),
    });
  return (
    <Button
      className='w-full'
      disabled={isLoading}
      onClick={() => jobDone({ status: 'DONE', postId })}>
      Set Job as Done
    </Button>
  );
}
