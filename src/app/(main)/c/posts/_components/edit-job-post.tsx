'use client';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobPost } from '@prisma/client';
import { Loader2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1),
  barangay: z.string().min(1),
  address: z.string().min(1),
  description: z.string(),
  budgetRange: z.enum(['LOWBUDGET', 'MIDBUDGET', 'HIGHBUDGET']),
  category: z.enum(['CATERING', 'CONSTRUCTION', 'DEMOLITION']),
});

type Schema = z.infer<typeof schema>;

export default function EditJobPost({ post }: { post: JobPost }) {
  const [open, setOpen] = useState(false);
  const form = useForm<Schema>({
    defaultValues: {
      title: post.title,
      barangay: post.barangay,
      address: post.address,
      budgetRange: post.budgetRange,
      category: post.category,
      description: post.description ?? '',
    },
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const { mutate: updateJobPost, isLoading } =
    trpc.clients.jobPost.updateJobPost.useMutation({
      onSuccess: () => {
        router.refresh();
        setOpen(false);
      },
    });

  const submit = (data: Schema) => {
    updateJobPost({ ...data, postId: post.id });
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className='gap-2'>
          <Pencil className='w-4 h-4' />
          Edit
        </DropdownMenuItem>
      </SheetTrigger>

      <SheetContent side='bottom' className='h-full'>
        <SheetHeader>
          <SheetTitle className='font-bold'>Edit post</SheetTitle>
        </SheetHeader>
        <div className='flex flex-col py-6 h-full'>
          <div className='flex-grow flex flex-col gap-4'>
            <div className='grid gap-2'>
              <h3 className='font-semibold'>About job</h3>
              <Input
                placeholder='Title for your job post'
                className={cn(
                  form.formState.errors.title &&
                    'focus-visible:ring-red-500 focus-visible:ring-1 border-red-500',
                )}
                {...form.register('title')}
              />
              <Controller
                control={form.control}
                name='category'
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <SelectTrigger
                      className={cn(
                        form.formState.errors.category &&
                          'focus-visible:ring-red-500 focus-visible:ring-1 border-red-500',
                        field.value ? 'text-black' : 'text-muted-foreground',
                      )}>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        <SelectItem value='CATERING'>Catering</SelectItem>
                        <SelectItem value='CONSTRUCTION'>
                          Construction
                        </SelectItem>
                        <SelectItem value='DEMOLITION'>Demolition</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <Textarea
                placeholder='Description'
                className='h-24'
                {...form.register('description')}
              />
            </div>
            <div className='grid gap-2'>
              <h3 className='font-semibold'>Location</h3>
              <Input
                placeholder='Address'
                className={cn(
                  form.formState.errors.address &&
                    'focus-visible:ring-red-500 focus-visible:ring-1 border-red-500',
                )}
                {...form.register('address')}
              />
              <Controller
                control={form.control}
                name='barangay'
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <SelectTrigger
                      className={cn(
                        form.formState.errors.barangay &&
                          'focus-visible:ring-red-500 focus-visible:ring-1 border-red-500',
                        field.value ? 'text-black' : 'text-muted-foreground',
                      )}>
                      <SelectValue placeholder='Select barangay' />
                    </SelectTrigger>
                    <SelectContent className='max-h-64 overflow-y-auto'>
                      <SelectGroup>
                        <SelectLabel>Barangay</SelectLabel>
                        <SelectItem value='Balayhangin'>Balayhangin</SelectItem>
                        <SelectItem value='Bangyas'>Bangyas</SelectItem>
                        <SelectItem value='Dayap'>Dayap</SelectItem>
                        <SelectItem value='Hanggan'>Hanggan</SelectItem>
                        <SelectItem value='Imok'>Imok</SelectItem>
                        <SelectItem value='Lamot 1'>Lamot 1</SelectItem>
                        <SelectItem value='Lamot 2'>Lamot 2</SelectItem>
                        <SelectItem value='Limao'>Limao</SelectItem>
                        <SelectItem value='Mabacan'>Mabacan</SelectItem>
                        <SelectItem value='Masiit'>Masiit</SelectItem>
                        <SelectItem value='Paliparan'>Paliparan</SelectItem>
                        <SelectItem value='Perez'>Perez</SelectItem>
                        <SelectItem value='Kanluran'>Kanluran</SelectItem>
                        <SelectItem value='Silangan'>Silangan</SelectItem>
                        <SelectItem value='Prinza'>Prinza</SelectItem>
                        <SelectItem value='San Isidro'>San Isidro</SelectItem>
                        <SelectItem value='Santo Tomas'>Santo Tomas</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className='grid gap-2'>
              <h3 className='font-semibold'>Budget Range</h3>
              <Controller
                control={form.control}
                name='budgetRange'
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <SelectTrigger
                      className={cn(
                        form.formState.errors.budgetRange &&
                          'focus-visible:ring-red-500 focus-visible:ring-1 border-red-500',
                        field.value ? 'text-black' : 'text-muted-foreground',
                      )}>
                      <SelectValue placeholder='Select budget range' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Budget Range</SelectLabel>
                        <SelectItem value='LOWBUDGET'>1000 - 10,000</SelectItem>
                        <SelectItem value='MIDBUDGET'>
                          10,001 - 50,000
                        </SelectItem>
                        <SelectItem value='HIGHBUDGET'>
                          50,001 - 100,000
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <Button disabled={isLoading} onClick={form.handleSubmit(submit)}>
            {isLoading ? <Loader2 className='w-4 h-4' /> : 'Edit job'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
