import MyJobsList from './_components/my-jobs-list';
import PostJobButton from './_components/post-job-button';

export default function PostsPage() {
  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-semibold'>My Job Posts</h2>
        <PostJobButton />
      </div>
      <div className='pt-4'>
        <MyJobsList />
      </div>
    </div>
  );
}
