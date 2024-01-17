'use client';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
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
import { calculateWage, cn, jobCategories, toPhp } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1),
  barangay: z.string().min(1),
  address: z.string().min(1),
  contactNumber: z.string(),
  description: z.string(),
  price: z.number().min(1),
  category: z.enum(jobCategories),
});

type Schema = z.infer<typeof schema>;

export default function PostJobButton() {
  const [open, setOpen] = useState(false);

  const form = useForm<Schema>({ resolver: zodResolver(schema) });

  const utils = trpc.useUtils();

  const { mutate: postJob } = trpc.clients.jobPost.postJob.useMutation({
    onSuccess: () => {
      utils.clients.jobPost.getUserJobs.invalidate();
      form.reset({
        description: '',
        barangay: '',
        price: 0,
        contactNumber: '',
        address: '',
        title: '',
      });
      setOpen(false);
    },
  });

  const watchCategory = form.watch('category');
  const watchPrice = form.watch('price');

  const submit = async (data: Schema) => {
    const minPrice = calculateWage(watchCategory);
    if (watchPrice < minPrice) {
      form.setError('price', {
        type: 'min',
        message:
          'Price should be at least the minimum wage for the selected category',
      });
      return;
    }
    postJob({ ...data });
    form.clearErrors();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className='flex gap-1'>
          Post a job <Plus className='h-5 w-5' />
        </Button>
      </SheetTrigger>
      <SheetContent side='bottom' className='h-full'>
        <SheetHeader>
          <SheetTitle className='font-bold'>Post a job</SheetTitle>
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
                        <SelectItem value='MASON'>Mason</SelectItem>
                        <SelectItem value='LABOR'>Labor</SelectItem>
                        <SelectItem value='HELPER'>Helper</SelectItem>
                        <SelectItem value='WELDER'>Welder</SelectItem>
                        <SelectItem value='ELECTRICIAN'>Electrician</SelectItem>
                        <SelectItem value='PLUMBING'>Plumbing</SelectItem>
                        <SelectItem value='MOTOR_MECHANIC'>
                          Motor Mechanic
                        </SelectItem>
                        <SelectItem value='CAR_MECHANIC'>
                          Car Mechanic
                        </SelectItem>
                        <SelectItem value='HOUSE_CLEANING'>
                          House Cleaning
                        </SelectItem>
                        <SelectItem value='SLIDING_GLASS_MAKER'>
                          Sliding Glass Maker
                        </SelectItem>
                        <SelectItem value='ROOF_SERVICE'>
                          Roof Service
                        </SelectItem>
                        <SelectItem value='PAINT_SERVICE'>
                          Paint Service
                        </SelectItem>
                        <SelectItem value='COMPUTER_TECHNICIAN'>
                          Computer Technician
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <Input
                placeholder='Contact number'
                {...form.register('contactNumber')}
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
              <h3 className='font-semibold'>
                Price (Mimimum of {toPhp(calculateWage(watchCategory))})
              </h3>
              <Input
                placeholder={calculateWage(watchCategory).toString()}
                className={cn(
                  form.formState.errors.price &&
                    'focus-visible:ring-red-500 focus-visible:ring-1 border-red-500',
                )}
                {...form.register('price', { valueAsNumber: true })}
              />
            </div>
          </div>
          <Button onClick={form.handleSubmit(submit)}>Post job</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
