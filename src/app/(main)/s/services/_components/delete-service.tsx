'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteService({ serviceId }: { serviceId: string }) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const util = trpc.useUtils();

  const { mutate: deleteService, isLoading } =
    trpc.services.deleteService.useMutation({
      onSuccess: () => {
        util.services.getUserServices.invalidate();
        setOpen(false);
        router.replace('/s/services');
      },
    });

  const submit = () => {
    deleteService({ serviceId });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='justify-self-end' asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className='gap-2'>
          <Trash className='w-4 h-4' />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-left'>Delete Post</DialogTitle>
          <DialogDescription className='text-left'>
            Are you sure you want to delete this post?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex items-center gap-2 justify-end flex-row'>
          <Button
            variant='outline'
            onClick={() => setOpen(false)}
            disabled={isLoading}>
            Cancel
          </Button>
          <Button variant='outline' onClick={submit} disabled={isLoading}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
