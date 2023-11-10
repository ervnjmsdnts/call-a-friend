'use client';

import { trpc } from '@/app/_trpc/client';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserRole } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AssignRole() {
  const [selectedRole, setSelectedRole] = useState<UserRole>();

  const router = useRouter();

  const { mutate: assignRole, isLoading } = trpc.auth.assignRole.useMutation({
    onSuccess: ({ updatedRole }) => {
      if (updatedRole === 'CLIENT') return router.replace('/c/posts');
      if (updatedRole === 'SERVICE') return router.replace('/s/services');
    },
  });

  const submit = () => {
    assignRole({ role: selectedRole! });
  };

  return (
    <div>
      <Header />
      <div className='px-8 py-2'>
        <div className='border px-6 py-4 rounded-lg'>
          <div className='flex flex-col gap-4'>
            <h2 className='text-center font-bold text-lg'>
              Get involved as a client or contractor.
            </h2>
            <RadioGroup
              className='flex flex-col gap-2'
              onValueChange={(data) => setSelectedRole(data as UserRole)}>
              <Label
                htmlFor='option1'
                className={`border rounded-md p-2 flex flex-col justify-center items-center hover:cursor-pointer relative ${
                  selectedRole === 'CLIENT' && 'border-primary border-2'
                }`}>
                <RadioGroupItem
                  value='CLIENT'
                  id='option1'
                  className='absolute right-3 top-3'
                />
                <div className='relative w-[200px] h-[200px]'>
                  <Image fill alt='Client' src='/provide-services.svg' />
                </div>
                <div className='text-center text-lg'>
                  <p>I am a client,</p>
                  <p>looking for services</p>
                </div>
              </Label>
              <Label
                htmlFor='option2'
                className={`border rounded-md p-2 flex flex-col justify-center items-center hover:cursor-pointer relative ${
                  selectedRole === 'SERVICE' && 'border-primary border-2'
                }`}>
                <RadioGroupItem
                  value='SERVICE'
                  id='option2'
                  className='absolute right-3 top-3'
                />
                <div className='relative w-[200px] h-[200px]'>
                  <Image fill alt='Service' src='/looking-for-talent.svg' />
                </div>
                <div className='text-center text-lg'>
                  <p>I am a contractor,</p>
                  <p>I&apos;ll provide the service</p>
                </div>
              </Label>
            </RadioGroup>
            <div className='flex flex-col gap-1 items-center'>
              <Button
                className='self-center w-full'
                onClick={submit}
                disabled={!selectedRole || isLoading}>
                {isLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
