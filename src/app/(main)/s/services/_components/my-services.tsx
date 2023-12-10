'use client';

import { trpc } from '@/app/_trpc/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toTitleCase } from '@/lib/utils';
import { format } from 'date-fns';
import { Ghost, Loader2, Star } from 'lucide-react';
import Link from 'next/link';

export default function MyServices() {
  const { data: services, isLoading } =
    trpc.services.getUserServices.useQuery();
  return (
    <div>
      {services && services.length > 0 ? (
        <div className='flex flex-col gap-3 w-full'>
          {services.map((service) => {
            const totalRating = service.ratings.reduce(
              (sum, rating) => sum + rating.rating,
              0,
            );
            const averageRating = totalRating / service.ratings.length;
            const maxRating = Math.min(averageRating, 5) || 0;

            return (
              <div key={service.id} className='border rounded-lg p-4'>
                <div className='space-y-4'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h2 className='text-lg font-semibold'>{service.name}</h2>
                    </div>
                    <div>
                      <div className='flex items-center justify-end gap-1'>
                        <Star className='fill-yellow-400 w-4 h-4 stroke-yellow-400' />
                        <p className='text-sm'>{maxRating}</p>
                      </div>
                    </div>
                  </div>
                  {service.description ? (
                    <p className='text-sm'>{service.description}</p>
                  ) : null}

                  <div className='flex justify-between items-center'>
                    <Badge variant='secondary'>
                      {toTitleCase(service.category)}
                    </Badge>
                    <Button variant='outline' asChild>
                      <Link href={`/s/services/${service.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
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
