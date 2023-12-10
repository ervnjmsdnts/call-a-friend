'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn, getBudgetRange, toPhp, toTitleCase } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  InviteService,
  JobPost,
  Service,
  ServiceRating,
  User,
} from '@prisma/client';
import { format } from 'date-fns';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  postId: z.string().min(1),
  message: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export default function JobService({
  service,
  postId,
}: {
  service: Service & {
    user: User;
    invitations: InviteService[];
    ratings: (ServiceRating & { jobPost: JobPost })[];
  };
  postId: string;
}) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { postId },
  });

  const router = useRouter();

  const totalRating = service.ratings.reduce(
    (sum, rating) => sum + rating.rating,
    0,
  );
  const averageRating = totalRating / service.ratings.length;
  const maxRating = Math.min(averageRating, 5) || 0;

  const { data: myPosts, isLoading } =
    trpc.clients.jobPost.getUserJobs.useQuery();
  const { mutate: inviteService, isLoading: inviteLoading } =
    trpc.clients.invitation.inviteService.useMutation({
      onSuccess: () => router.refresh(),
    });
  const { mutate: cancelInvite, isLoading: cancelLoading } =
    trpc.clients.invitation.cancelInvitation.useMutation({
      onSuccess: () => router.refresh(),
    });

  const watchPostId = form.watch('postId');

  const alreadyInvitedToPost = service.invitations.find(
    (invite) => invite.jobPostId === watchPostId && invite.status === 'PENDING',
  );

  const submit = (data: Schema) => {
    inviteService({ postId: data.postId, serviceId: service.id });
  };

  const handleCancel = () => {
    if (!alreadyInvitedToPost) return;

    cancelInvite({ invitationId: alreadyInvitedToPost.id });
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='space-y-4 flex-1'>
        <div>
          <div className='flex items-start justify-between'>
            <h2 className='text-2xl font-bold'>{service.name}</h2>
            <div className='flex items-center justify-end gap-1'>
              <Star className='fill-yellow-400 w-4 h-4 stroke-yellow-400' />
              <p className='text-sm'>{maxRating}</p>
            </div>
          </div>
          <p className=''>{service.user.name}</p>
          <p className='text-sm text-muted-foreground'>
            Posted on {format(new Date(service.createdAt), 'PP')}
          </p>
        </div>
        <p>{service.description}</p>
        <div>
          <h2 className='text-lg font-semibold'>Category</h2>
          <p>{toTitleCase(service.category)}</p>
        </div>
        <div>
          <h2 className='text-lg font-semibold'>Location</h2>
          <p>
            {service.address}, Brgy. {service.barangay}
          </p>
        </div>
        <div>
          <h2 className='text-lg font-semibold'>Price</h2>
          <p>{toPhp(service.price)}</p>
        </div>
        <div>
          <h2 className='text-lg font-semibold'>
            Ratings ({service.ratings.length})
          </h2>
          <div className='flex flex-col gap-2'>
            {service.ratings.map((rate) => (
              <div key={rate.id}>
                <div className='p-4 border rounded-lg w-full'>
                  <div className='flex justify-between gap-1 items-start'>
                    <div>
                      <p className='font-semibold'>{rate.jobPost.title}</p>
                      <p className='text-sm'>
                        {rate.comment ? rate.comment : 'No Comment'}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {format(new Date(rate.createdAt), 'PPp')}
                      </p>
                    </div>
                    <div className='flex items-center justify-end gap-1'>
                      <Star className='fill-yellow-400 w-4 h-4 stroke-yellow-400' />
                      <p className='text-sm'>{rate.rating}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button>Invite</Button>
        </SheetTrigger>
        <SheetContent side='bottom' className='h-[350px]'>
          <form
            onSubmit={form.handleSubmit(submit)}
            className='flex flex-col h-full'>
            <h3 className='font-semibold text-lg mb-4'>Invite Service</h3>
            <div className='flex-1 flex flex-col gap-2'>
              <Controller
                control={form.control}
                name='postId'
                render={({ field }) => (
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <SelectTrigger
                      className={cn(
                        form.formState.errors.postId &&
                          'focus-visible:ring-red-500 focus-visible:ring-1 border-red-500',
                        field.value ? 'text-black' : 'text-muted-foreground',
                      )}>
                      <SelectValue placeholder='Select post' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>My Posts</SelectLabel>
                        {myPosts?.map((post) => (
                          <SelectItem key={post.id} value={post.id}>
                            {post.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <Textarea
                placeholder='Message'
                className='h-24'
                {...form.register('message')}
              />
            </div>
            <div className='flex gap-1 justify-end'>
              {Boolean(alreadyInvitedToPost) ? (
                <Button
                  type='button'
                  onClick={handleCancel}
                  variant='destructive'
                  disabled={cancelLoading}>
                  Cancel Invitation
                </Button>
              ) : null}
              <Button
                disabled={
                  isLoading ||
                  inviteLoading ||
                  Boolean(alreadyInvitedToPost) ||
                  !watchPostId ||
                  cancelLoading
                }>
                {Boolean(alreadyInvitedToPost) ? 'Already Invited' : 'Invite'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
