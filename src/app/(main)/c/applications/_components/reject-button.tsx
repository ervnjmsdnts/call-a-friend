'use client';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RejectButton({
  applicationId,
}: {
  applicationId: string;
}) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { mutate: rejectApplication, isLoading } =
    trpc.clients.jobPost.rejectApplication.useMutation({
      onSuccess: () => {
        router.refresh();
        router.back();
      },
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-full' variant='outline'>
          Reject Application
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <p className='text-lg'>
          Are you sure you want to reject this application?
        </p>
        <DialogFooter className='flex gap-2 flex-row justify-end'>
          <Button disabled={isLoading} onClick={() => setOpen(false)}>
            No
          </Button>
          <Button
            disabled={isLoading}
            onClick={() => rejectApplication({ applicationId })}
            variant='outline'>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
