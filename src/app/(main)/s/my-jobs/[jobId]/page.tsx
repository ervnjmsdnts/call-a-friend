import { db } from '@/db';
import Post from '../_component/post';
import { notFound } from 'next/navigation';

export default async function Job({ params }: { params: { jobId: string } }) {
  const { jobId } = params;
  const post = await db.jobPost.findFirst({
    where: { id: jobId },
    include: { acceptedService: { include: { ratings: true } } },
  });

  if (!post || !post.id) return notFound();

  const serviceRating = await db.serviceRating.findFirst({
    where: { jobPostId: post.id },
  });

  return <Post post={post} serviceRating={serviceRating} />;
}
