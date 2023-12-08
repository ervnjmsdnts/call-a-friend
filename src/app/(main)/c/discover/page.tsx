import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { toTitleCase } from '@/lib/utils';
import { Star } from 'lucide-react';
import Link from 'next/link';

export default async function DiscoverServicesPage() {
  const services = await db.service.findMany({
    include: { user: true, ratings: true },
  });

  return (
    <div>
      <h2 className='text-lg font-semibold'>Discover Services</h2>
      <div className='flex flex-col gap-3 mt-4 w-full'>
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
                    <p className='text-sm text-muted-foreground'>
                      {service.user.name}
                    </p>
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
                  <Button asChild>
                    <Link href={`/c/discover/${service.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
