import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Landing() {
  return (
    <div>
      <Header hasAction />
      <main>
        <section className='flex flex-col justify-start items-center'>
          <div className='relative w-[300px] h-[300px]'>
            <Image src='/landing.svg' alt='Landing' fill />
          </div>
          <p className='text-center px-4 text-lg text-muted-foreground'>
            Where Talents Meet Opportunities And Your Compass To A World Of
            Possibilities
          </p>
          <Button className='mt-4 px-6 text-md' asChild>
            <Link href='/auth?state=signup'>Get Started</Link>
          </Button>
        </section>
        <section></section>
      </main>
    </div>
  );
}
