import { db } from '@/db';
import { notFound } from 'next/navigation';
import JobService from '../_components/job-service';

export default async function ServicePost({
  params,
  searchParams,
}: {
  params: { postId: string };
  searchParams: { service: string };
}) {
  const { postId } = params;
  const { service } = searchParams;

  const post = await db.jobPost.findFirst({
    where: { id: postId },
    include: { user: true },
  });

  if (!post || !post.id) return notFound();

  return <JobService post={post} />;
}
