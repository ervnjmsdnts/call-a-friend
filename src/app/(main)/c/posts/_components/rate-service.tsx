'use client';

import { trpc } from '@/app/_trpc/client';
import StarRating from '@/components/star-rating';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({ comment: z.string().optional() });

type Schema = z.infer<typeof schema>;

export default function RateService({
  postId,
  serviceId,
  isRated,
}: {
  postId: string;
  serviceId: string;
  isRated: boolean;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(1);
  const [open, setOpen] = useState(false);
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const { mutate: rateService, isLoading } =
    trpc.clients.jobPost.rateService.useMutation({
      onSuccess: () => {
        setOpen(false);
        router.refresh();
      },
    });

  const form = useForm<Schema>({ resolver: zodResolver(schema) });

  const submit = (data: Schema) => {
    rateService({ comment: data.comment, rating, postId, serviceId });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button disabled={isRated}>Rate Service</Button>
      </SheetTrigger>
      <SheetContent className='h-[350px]' side='bottom'>
        <form
          onSubmit={form.handleSubmit(submit)}
          className='flex flex-col gap-2 h-full'>
          <h3 className='font-semibold text-lg'>Rate Service</h3>
          <div className='flex-1'>
            <div className='flex mb-2 justify-center'>
              <StarRating onRatingChange={handleRatingChange} rating={rating} />
            </div>
            <Textarea
              placeholder='Comment (optional)'
              {...form.register('comment')}
              className='h-24'
            />
          </div>
          <Button disabled={isLoading}>Submit</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
