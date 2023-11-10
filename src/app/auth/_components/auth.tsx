'use client';

import { useState } from 'react';
import SignUp from './sign-up';
import Login from './login';

export default function Auth({ state }: { state: string }) {
  const [isLogin, setIsLogin] = useState(state === 'login' ? true : false);

  const createAccount = () => setIsLogin(false);
  const login = () => setIsLogin(true);

  return (
    <>
      {!isLogin ? <SignUp action={login} /> : <Login action={createAccount} />}
    </>
  );
}
