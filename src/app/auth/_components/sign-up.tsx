import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z
  .object({
    name: z.string().min(1, 'Required field'),
    email: z.string().email().min(1, 'Required field'),
    password: z.string().min(8, 'Must contain atleast 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((arg) => arg.password === arg.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type Schema = z.infer<typeof schema>;

export default function SignUp({ action }: { action: () => void }) {
  const form = useForm<Schema>({ resolver: zodResolver(schema) });

  const submit = (data: Schema) => {};

  return (
    <div className='p-8'>
      <div className='p-6 border rounded-lg'>
        <div className='text-center mb-4'>
          <h2 className='text-2xl font-semibold'>Sign Up</h2>
          <p className='text-muted-foreground '>
            Enter your information to create an account
          </p>
        </div>
        <div className='grid gap-3'>
          <div>
            <Input placeholder='Name' {...form.register('name')} />
            {form.formState.errors.name ? (
              <span className='text-xs text-red-400'>
                {form.formState.errors.name.message}
              </span>
            ) : null}
          </div>
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
          <div>
            <Input
              placeholder='Confirm Password'
              type='password'
              {...form.register('confirmPassword')}
            />
            {form.formState.errors.confirmPassword ? (
              <span className='text-xs text-red-400'>
                {form.formState.errors.confirmPassword.message}
              </span>
            ) : null}
          </div>
        </div>
        <Button
          onClick={form.handleSubmit(submit)}
          className='w-full mt-6 mb-2'>
          Create my account
        </Button>
        <p>
          Already have an account?{' '}
          <Button variant='link' onClick={action} className='p-0 font-semibold'>
            Login
          </Button>
        </p>
      </div>
    </div>
  );
}
