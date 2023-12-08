import { Button } from '@/components/ui/button';
import { ArrowLeft, Ghost } from 'lucide-react';
import Link from 'next/link';

export default function PostNotFound() {
  return (
    <div className='flex flex-col gap-4 justify-center pt-16 items-center h-full'>
      <div className='flex flex-col items-center gap-1'>
        <Ghost className='w-8 h-8' />
        <p className='text-lg font-semibold'>Service not found</p>
      </div>
      <Button className='flex items-center gap-2' variant='outline' asChild>
        <Link href='/c/posts'>
          <ArrowLeft className='w-4 h-4' />
          Go back
        </Link>
      </Button>
    </div>
  );
}
