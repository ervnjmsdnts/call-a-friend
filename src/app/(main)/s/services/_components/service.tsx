import { toPhp, toTitleCase } from '@/lib/utils';
import { JobPost, Service, ServiceRating, User } from '@prisma/client';
import { format } from 'date-fns';
import ActionDropdown from './action-dropdown';
import { Star } from 'lucide-react';

export default function Service({
  service,
}: {
  service: Service & {
    ratings: (ServiceRating & { jobPost: JobPost })[];
    user: User;
  };
}) {
  const totalRating = service.ratings.reduce(
    (sum, rating) => sum + rating.rating,
    0,
  );
  const averageRating = totalRating / service.ratings.length;
  const maxRating = Math.min(averageRating, 5) || 0;

  return (
    <div className='flex flex-col h-full'>
      <div className='space-y-4 flex-1'>
        <div>
          <div className='flex items-start justify-between'>
            <h2 className='text-2xl font-bold'>{service.name}</h2>
            <ActionDropdown service={service} />
          </div>
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
    </div>
  );
}
