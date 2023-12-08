import { db } from '@/db';
import { notFound } from 'next/navigation';
import Post from '../_components/post';

export default async function SinglePostPage({
  params,
}: {
  params: { postId: string };
}) {
  const { postId } = params;

  const post = await db.jobPost.findFirst({
    where: { id: postId },
    include: { acceptedService: { include: { user: true, ratings: true } } },
  });

  if (!post || !post.id) return notFound();

  const services = await db.service.findMany({
    where: {
      barangay: post.barangay,
      priceRange: post.budgetRange,
      category: post.category,
    },
    include: { user: { select: { name: true } }, ratings: true },
  });

  const shuffledServices = services.sort(() => Math.random() - 0.5);

  const suggestedServices = shuffledServices.slice(0, 4);

  const serviceRating = await db.serviceRating.findFirst({
    where: { jobPostId: post.id },
  });

  return (
    <Post
      post={post}
      suggestedServices={suggestedServices || []}
      serviceRating={serviceRating}
    />
  );
}
