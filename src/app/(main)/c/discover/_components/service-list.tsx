'use client';

import { trpc } from '@/app/_trpc/client';
import { Badge } from '@/components/ui/badge';
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
import { jobCategories, toTitleCase } from '@/lib/utils';
import { Ghost, Loader2, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ServiceList() {
  const { data: services, isLoading } = trpc.services.getAll.useQuery();

  const [searchUser, setSearchUser] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    (typeof jobCategories)[number] | undefined
  >(undefined);

  const filteredServices = services?.filter((service) => {
    const categoryMatch =
      !selectedCategory || service.category === selectedCategory;
    const userMatch =
      !searchUser ||
      service.user.name.toLowerCase().includes(searchUser.toLowerCase());

    return selectedCategory && searchUser
      ? categoryMatch && userMatch
      : selectedCategory
      ? categoryMatch
      : searchUser
      ? userMatch
      : true;
  });

  return (
    <div>
      <div className='flex justify-end'>
        <div className='flex items-center gap-1'>
          <Input
            placeholder='Search provider'
            onChange={(e) => setSearchUser(e.target.value)}
            value={searchUser}
          />
          <Select
            onValueChange={(value: (typeof jobCategories)[number]) =>
              setSelectedCategory(value)
            }
            defaultValue={selectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder='Select category' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem value='CATERING'>Catering</SelectItem>
                <SelectItem value='CONSTRUCTION'>Construction</SelectItem>
                <SelectItem value='DEMOLITION'>Demolition</SelectItem>
                <SelectItem value='MASON'>Mason</SelectItem>
                <SelectItem value='LABOR'>Labor</SelectItem>
                <SelectItem value='HELPER'>Helper</SelectItem>
                <SelectItem value='WELDER'>Welder</SelectItem>
                <SelectItem value='ELECTRICIAN'>Electrician</SelectItem>
                <SelectItem value='PLUMBING'>Plumbing</SelectItem>
                <SelectItem value='MOTOR_MECHANIC'>Motor Mechanic</SelectItem>
                <SelectItem value='CAR_MECHANIC'>Car Mechanic</SelectItem>
                <SelectItem value='HOUSE_CLEANING'>House Cleaning</SelectItem>
                <SelectItem value='SLIDING_GLASS_MAKER'>
                  Sliding Glass Maker
                </SelectItem>
                <SelectItem value='ROOF_SERVICE'>Roof Service</SelectItem>
                <SelectItem value='PAINT_SERVICE'>Paint Service</SelectItem>
                <SelectItem value='COMPUTER_TECHNICIAN'>
                  Computer Technician
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {filteredServices && filteredServices.length > 0 ? (
        <div className='flex flex-col gap-3 mt-4 w-full'>
          {filteredServices.map((service) => {
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
                      <Link href={`/c/discover/${service.id}`}>
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
