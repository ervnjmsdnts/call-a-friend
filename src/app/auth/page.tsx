import Header from '@/components/header';
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
