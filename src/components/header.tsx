import Link from 'next/link';
import { Button } from './ui/button';

export default function Header({
  hasAction,
  isLink,
}: {
  hasAction?: boolean;
  isLink?: boolean;
}) {
  return (
    <header className='border-b flex items-center justify-between p-4'>
      {isLink ? (
        <Button
          variant='link'
          className='text-primary text-lg font-semibold p-0'
          asChild>
          <Link href='/'>Call a Friend</Link>
        </Button>
      ) : (
        <h2 className='text-primary text-lg font-semibold'>Call a Friend</h2>
      )}
      {hasAction ? (
        <Button variant='outline' asChild>
          <Link href='/auth?state=login'>Login</Link>
        </Button>
      ) : null}
    </header>
  );
}
