import { getBudgetRange } from '@/lib/utils';
import { JobPost, Service, ServiceRating, User } from '@prisma/client';
import { format } from 'date-fns';
import ActionDropdown from './action-dropdown';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import qs from 'querystring';
import SetJobDoneButton from './set-job-done-button';
import TerminateJobButton from './terminate-job-button';
import { Badge } from '@/components/ui/badge';
import RateService from './rate-service';

type TSuggestedService = Service & {
  user: { name: string };
  ratings: ServiceRating[];
};

function PostService({
  service,
  postId,
}: {
  service: TSuggestedService;
  postId: string;
}) {
  const inviteQuery = qs.stringify({ post: postId });

  const totalRating = service.ratings.reduce(
    (sum, rating) => sum + rating.rating,
    0,
  );
  const averageRating = totalRating / service.ratings.length;
  const maxRating = Math.min(averageRating, 5) || 0;

  return (
    <div className='p-4 border rounded-lg w-80'>
      <div className='mb-3'>
        <div className='flex justify-between items-start'>
          <p className='font-semibold'>{service.name}</p>
          <div className='flex items-center justify-end gap-1'>
            <Star className='fill-yellow-400 w-4 h-4 stroke-yellow-400' />
            <p className='text-sm'>{maxRating}</p>
          </div>
        </div>
        <p className='text-sm'>{service.user.name}</p>
      </div>
      <div className='flex justify-end'>
        <Button asChild>
          <Link href={`/c/discover/${service.id}?${inviteQuery}`}>
            View Details
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function Post({
  post,
  suggestedServices,
  serviceRating,
}: {
  post: JobPost & {
    acceptedService:
      | (Service & { user: User; ratings: ServiceRating[] })
      | null;
  };
  suggestedServices: TSuggestedService[];
  serviceRating: ServiceRating | null;
}) {
  const isRated = Boolean(serviceRating);

  const totalRating =
    post?.acceptedService?.ratings.reduce(
      (sum, rating) => sum + rating.rating,
      0,
    ) || 0;
  const averageRating =
    totalRating && post.acceptedService
      ? totalRating / post.acceptedService.ratings.length
      : 0;
  const maxRating = Math.min(averageRating, 5) || 0;

  return (
    <div className='flex flex-col h-full'>
      <div className='space-y-4 flex-1'>
        <div>
          <div className='flex justify-between gap-2'>
            <h2 className='text-2xl font-bold'>{post.title}</h2>
            {!post.acceptedService && !post.serviceId ? (
              <ActionDropdown post={post} />
            ) : null}
          </div>
          <p className='text-sm text-muted-foreground'>
            Posted on {format(new Date(post.createdAt), 'PP')}
          </p>
          <Badge variant='outline'>{post.status}</Badge>
        </div>
        <p>{post.description}</p>
        <div>
          <h2 className='text-lg font-semibold'>Location</h2>
          <p>
            {post.address}, Brgy. {post.barangay}
          </p>
        </div>
        <div>
          <h2 className='text-lg font-semibold'>Budget Range</h2>
          <p>{getBudgetRange(post.budgetRange)}</p>
        </div>
        {post.serviceId && post.acceptedService?.id && post.acceptedService ? (
          <div>
            <h2 className='text-lg font-semibold'>Accepted Service</h2>
            <div className='p-4 border rounded-lg w-full'>
              <div className='mb-3'>
                <div className='flex justify-between items-start'>
                  <p className='font-semibold text-xl'>
                    {post.acceptedService.name}
                  </p>
                  <div className='flex items-center justify-end gap-1'>
                    <Star className='fill-yellow-400 w-4 h-4 stroke-yellow-400' />
                    <p className='text-sm'>{maxRating}</p>
                  </div>
                </div>
                <p className='text-md'>{post.acceptedService.user.name}</p>
              </div>
              <div className='flex justify-end'>
                <Button asChild variant='outline'>
                  <Link href={`/c/discover/${post.serviceId}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className='text-lg font-semibold'>Suggested Services</h2>
            <div className='w-full flex overflow-x-auto'>
              <div className='flex-1 flex items-center gap-2'>
                {suggestedServices.map((service) => (
                  <PostService
                    key={service.id}
                    service={service}
                    postId={post.id}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {serviceRating && serviceRating.id ? (
          <div>
            <h2 className='text-lg font-semibold'>My Rating</h2>
            <div className='p-4 border rounded-lg w-full'>
              <div className='flex justify-between gap-1 items-start'>
                <div>
                  <p className='text-sm'>
                    {serviceRating.comment
                      ? serviceRating.comment
                      : 'No Comment'}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {format(new Date(serviceRating.createdAt), 'PPp')}
                  </p>
                </div>
                <div className='flex items-center justify-end gap-1'>
                  <Star className='fill-yellow-400 w-4 h-4 stroke-yellow-400' />
                  <p className='text-sm'>{serviceRating.rating}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {post.serviceId && post.acceptedService ? (
        <>
          {post.status === 'ONGOING' ? (
            <div className='flex gap-2'>
              <TerminateJobButton postId={post.id} />
              <SetJobDoneButton postId={post.id} />
            </div>
          ) : null}

          {post.status === 'TERMINATED' || post.status === 'DONE' ? (
            <RateService
              isRated={isRated}
              postId={post.id}
              serviceId={post.serviceId}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
