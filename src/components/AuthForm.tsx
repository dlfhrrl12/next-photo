'use client';

import { FormEvent, useState } from 'react';

const AuthForm = () => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // supabase login
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // supabase sign up
  };

  let signInMessage = 'Sign In';
  if (isSigningIn) {
    signInMessage = 'Signing In';
  } else if (isNewUser) {
    signInMessage = 'Sign Up';
  }

  const signUpMessage = (
    <p className="text-center text-white">
      Email sent! Check Your Email to confirm sign up.
    </p>
  );

  return (
    <form
      onSubmit={isNewUser ? handleSignUp : handleLogin}
      className="space-y-8"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="appearance-none rounded relative block w-full px-3 py-2 border bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="appearance-none rounded relative block w-full px-3 py-2 border bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      <button
        type="submit"
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
      >
        {signInMessage}
      </button>
      <p className="text-center text-white">
        {isNewUser ? (
          <>
            Already have on account?
            <button
              type="button"
              className="text-indigo-400 hover:text-indigo-600"
              onClick={() => setIsNewUser(false)}
            >
              Sign In
            </button>
          </>
        ) : (
          <>
            Don't have on account?
            <button
              type="button"
              className="text-indigo-400 hover:text-indigo-600"
              onClick={() => setIsNewUser(true)}
            >
              Sign Up
            </button>
          </>
        )}
      </p>
      {isSigningUp && signUpMessage}
    </form>
  );
};

export default AuthForm;
