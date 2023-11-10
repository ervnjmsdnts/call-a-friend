'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email().min(1, 'Field is required'),
  password: z.string().min(8, 'Must contain atleast 8 characters'),
});

type Schema = z.infer<typeof schema>;

export default function Login({ action }: { action: () => void }) {
  const form = useForm<Schema>();

  const router = useRouter();
  const { toast } = useToast();

  const { mutate: login, isLoading } = trpc.auth.login.useMutation({
    onSuccess: () => {
      router.push('/auth/assign-role');
    },
    onError: (error) => {
      toast({
        title: 'Something went wrong',
        description: error.message,
        variant: 'destructive',
      });
      form.reset({ email: '', password: '' });
    },
  });

  const submit = (data: Schema) => {
    login({ ...data });
  };

  return (
    <div className='p-8'>
      <div className='p-6 border rounded-lg'>
        <div className='text-center mb-4'>
          <h2 className='text-2xl font-semibold'>Log in</h2>
          <p className='text-muted-foreground '>
            Enter your credentials to access your account
          </p>
        </div>
        <div className='grid gap-3'>
          <div>
            <Input placeholder='Email Address' {...form.register('email')} />
            {form.formState.errors.email ? (
              <span className='text-xs text-red-400'>
                {form.formState.errors.email.message}
              </span>
            ) : null}
          </div>
          <div>
            <Input
              placeholder='Password (8 characters or more)'
              type='password'
              {...form.register('password')}
            />
            {form.formState.errors.password ? (
              <span className='text-xs text-red-400'>
                {form.formState.errors.password.message}
              </span>
            ) : null}
          </div>
        </div>
        <Button
          onClick={form.handleSubmit(submit)}
          disabled={isLoading}
          className='w-full mt-6 mb-2'>
          {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Login'}
        </Button>
        <p>
          Don&apos;t have an account?{' '}
          <Button variant='link' onClick={action} className='p-0 font-semibold'>
            Sign up
          </Button>
        </p>
      </div>
    </div>
  );
}
