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
import { format } from 'date-fns';
import { Ghost, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function JobsList() {
  const { data: posts, isLoading } = trpc.clients.jobPost.getAll.useQuery();
  const [searchUser, setSearchUser] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    (typeof jobCategories)[number] | undefined
  >(undefined);

  const filteredPosts = posts?.filter((post) => {
    const categoryMatch =
      !selectedCategory || post.category === selectedCategory;
    const userMatch =
      !searchUser ||
      post.user.name.toLowerCase().includes(searchUser.toLowerCase());

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
            placeholder='Search client'
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
      {filteredPosts && filteredPosts.length > 0 ? (
        <div className='flex flex-col gap-3 mt-4 w-full'>
          {filteredPosts.map((post) => (
            <div key={post.id} className='border rounded-lg p-4'>
              <div className='space-y-4'>
                <div>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-semibold'>{post.title}</h2>
                    <Badge variant='secondary'>
                      {toTitleCase(post.category)}
                    </Badge>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {post.user.name}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {format(new Date(post.createdAt), 'PPp')}
                  </p>
                </div>
                <div className='flex justify-end'>
                  <Button asChild>
                    <Link href={`/s/discover/${post.id}`}>Apply Now</Link>
                  </Button>
                </div>
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
          <p className='font-medium text-muted-foreground'>No posts</p>
        </div>
      )}
    </div>
  );
}
