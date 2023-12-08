import { db } from '@/db';
import { notFound } from 'next/navigation';
import JobService from '../_components/job-service';

export default async function PostSingleService({
  params,
  searchParams,
}: {
  params: { serviceId: string };
  searchParams: { post: string };
}) {
  const { serviceId } = params;
  const { post } = searchParams;

  const service = await db.service.findFirst({
    where: { id: serviceId },
    include: {
      user: true,
      invitations: true,
      ratings: { include: { jobPost: true } },
    },
  });

  if (!service || !service.id) return notFound();

  return <JobService service={service} postId={post} />;
}
