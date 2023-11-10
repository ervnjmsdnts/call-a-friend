import { db } from '@/db';
import { notFound, redirect } from 'next/navigation';
import Post from '../_components/post';

export default async function SinglePostPage({
  params,
}: {
  params: { postId: string };
}) {
  const { postId } = params;

  const post = await db.jobPost.findFirst({ where: { id: postId } });

  if (!post || !post.id) return notFound();

  return <Post post={post} />;
}
