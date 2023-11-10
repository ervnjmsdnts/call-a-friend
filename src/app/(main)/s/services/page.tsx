import MyServices from './_components/my-services';
import PostServiceButton from './_components/post-service-button';

export default function ServicesPage() {
  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-semibold'>My Services</h2>
        <PostServiceButton />
      </div>
      <div className='pt-4'>
        <MyServices />
      </div>
    </div>
  );
}
