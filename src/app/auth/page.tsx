import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Auth from './_components/auth';

export default function AuthPage({
  searchParams,
}: {
  searchParams: { state: string };
}) {
  const { state } = searchParams;
  return (
    <div>
      <Header isLink />
      <Auth state={state} />
    </div>
  );
}
