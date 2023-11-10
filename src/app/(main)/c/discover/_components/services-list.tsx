'use client';
import { trpc } from '@/app/_trpc/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toTitleCase } from '@/lib/utils';
import { Ghost, Loader2 } from 'lucide-react';

export default function ServicesList() {
  const { data: services, isLoading } = trpc.services.getAll.useQuery();

  return (
    <div>
      {services && services.length > 0 ? (
        <div className='flex flex-col gap-3 mt-4 w-full'>
          {services.map((service) => (
            <div key={service.id} className='border rounded-lg p-4'>
              <div className='space-y-4'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h2 className='text-lg font-semibold'>{service.name}</h2>
                    <p className='text-sm text-muted-foreground'>
                      {service.user.name}
                    </p>
                  </div>
                  <Badge variant='secondary'>
                    {toTitleCase(service.category)}
                  </Badge>
                </div>
                {service.description ? (
                  <p className='text-sm'>{service.description}</p>
                ) : null}

                <Button className='w-full'>Details</Button>
              </div>
            </div>
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
