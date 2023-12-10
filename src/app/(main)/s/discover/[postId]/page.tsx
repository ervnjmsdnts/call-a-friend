import { db } from '@/db';
import JobService from '../_components/job-service';
import { notFound } from 'next/navigation';

export default async function ServicePost({
  params,
  searchParams,
}: {
  params: { postId: string };
  searchParams: { service: string };
}) {
  const { postId } = params;
  // const { service } = searchParams;

  const post = await db.jobPost.findFirst({
    where: { id: postId },
    include: { user: true, jobApplications: true },
  });

  if (!post || !post.id) return notFound();

  return <JobService post={post} />;
}
