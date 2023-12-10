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
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplyJob } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  serviceId: z.string().min(1),
  message: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export default function ApplyButton({
  postId,
  jobApplications,
}: {
  postId: string;
  jobApplications: ApplyJob[];
}) {
  const form = useForm<Schema>({ resolver: zodResolver(schema) });

  const router = useRouter();

  const { data: myServices, isLoading } =
    trpc.services.getUserServices.useQuery();

  const { mutate: applyToJob, isLoading: applyLoading } =
    trpc.services.applyToJob.useMutation({ onSuccess: () => router.refresh() });

  const { mutate: cancelApplication, isLoading: cancelLoading } =
    trpc.services.cancelApplication.useMutation({
      onSuccess: () => router.refresh(),
    });

  const watchServiceId = form.watch('serviceId');

  const serviceAppliedToJob = jobApplications.find(
    (app) => watchServiceId === app.serviceId && app.status === 'PENDING',
  );

  const submit = (data: Schema) => {
    applyToJob({
      serviceId: data.serviceId,
      message: data.message,
      postId,
    });
  };

  const handleCancel = () => {
    if (!serviceAppliedToJob) return;

    cancelApplication({ applicationId: serviceAppliedToJob.id });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Apply</Button>
      </SheetTrigger>
      <SheetContent className='h-[350px]' side='bottom'>
        <form
          onSubmit={form.handleSubmit(submit)}
          className='flex flex-col h-full'>
          <h3 className='font-semibold text-lg mb-4'>Apply to Job</h3>
          <div className='flex-1 flex flex-col gap-2'>
            <Controller
              control={form.control}
              name='serviceId'
              render={({ field }) => (
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger
                    className={cn(
                      form.formState.errors.serviceId &&
                        'focus-visible:ring-red-500 focus-visible:ring-1 border-red-500',
                      field.value ? 'text-black' : 'text-muted-foreground',
                    )}>
                    <SelectValue placeholder='Select service' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>My Services</SelectLabel>
                      {myServices?.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
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
            {Boolean(serviceAppliedToJob) ? (
              <Button
                type='button'
                onClick={handleCancel}
                variant='destructive'
                disabled={cancelLoading}>
                Cancel Application
              </Button>
            ) : null}
            <Button
              disabled={
                isLoading ||
                applyLoading ||
                Boolean(serviceAppliedToJob) ||
                !watchServiceId ||
                cancelLoading
              }>
              {Boolean(serviceAppliedToJob) ? 'Already Applied' : 'Apply'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
