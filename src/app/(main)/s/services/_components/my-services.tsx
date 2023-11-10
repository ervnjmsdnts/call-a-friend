'use client';

import { trpc } from '@/app/_trpc/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toTitleCase } from '@/lib/utils';
import { format } from 'date-fns';
import { Ghost, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function MyServices() {
  const { data: services, isLoading } =
    trpc.services.getUserServices.useQuery();
  return (
    <div>
      {services && services.length > 0 ? (
        <div className='flex flex-col gap-3 w-full'>
          {services.map((service) => (
            <Button
              key={service.id}
              variant='outline'
              asChild
              className='items-start flex-col py-8 w-full'>
              <Link href={`/s/services/${service.id}`}>
                <div className='flex items-start justify-between w-full'>
                  <div>
                    <h2 className='text-lg font-semibold'>{service.name}</h2>
                    <p className='text-sm text-muted-foreground'>
                      {format(new Date(service.createdAt), 'PPp')}
                    </p>
                  </div>

                  <Badge variant='secondary'>
                    {toTitleCase(service.category)}
                  </Badge>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      ) : isLoading ? (
        <div className='flex justify-center pt-12'>
          <Loader2 className='w-6 h-6 animate-spin' />
        </div>
      ) : (
        <div className='flex flex-col pt-12 gap-1 items-center'>
          <Ghost className='text-muted-foreground' />
          <p className='font-medium text-muted-foreground'>No services</p>
        </div>
      )}
    </div>
  );
}
