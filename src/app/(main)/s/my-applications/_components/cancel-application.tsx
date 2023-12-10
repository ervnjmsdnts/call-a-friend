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

export default function CancelApplication({
  applicationId,
}: {
  applicationId: string;
}) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const { mutate: cancelApplication, isLoading } =
    trpc.services.cancelApplication.useMutation({
      onSuccess: () => {
        router.refresh();
        router.back();
      },
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Cancel Application</Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <p className='text-lg'>
          Are you sure you want to cancel your application?
        </p>
        <DialogFooter className='flex gap-2 flex-row justify-end'>
          <Button onClick={() => setOpen(false)} disabled={isLoading}>
            No
          </Button>
          <Button
            variant='outline'
            disabled={isLoading}
            onClick={() => cancelApplication({ applicationId })}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
