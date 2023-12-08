import { getBudgetRange, toTitleCase } from '@/lib/utils';
import { Service } from '@prisma/client';
import { format } from 'date-fns';
import ActionDropdown from './action-dropdown';

export default function Service({ service }: { service: Service }) {
  return (
    <div className='space-y-4'>
      <div>
        <div className='flex justify-between'>
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
        <h2 className='text-lg font-semibold'>Price Range</h2>
        <p>{getBudgetRange(service.priceRange)}</p>
      </div>
      <div>
        <h2 className='text-lg font-semibold'>Ratings</h2>
        <p>No Ratings</p>
      </div>
    </div>
  );
}
