import Header from '@/components/header';
import Auth from './_components/auth';
import { supabaseServer } from '@/lib/supabase';

export default async function AuthPage({
  searchParams,
}: {
  searchParams: { state: string };
}) {
  const { state } = searchParams;

  const { data } = await supabaseServer.auth.getUser();

  return (
    <div>
      <Header isLink />
      <Auth state={state} />
    </div>
  );
}
