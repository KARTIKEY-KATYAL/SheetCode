import { useState } from 'react'
import Logo from './Logo'

type Props = {}

function SignUp({}: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Replace with actual login logic
    console.log('Sign Up with:', { email, password })
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center 
      bg-gradient-to-bl from-[#ffe4e6] to-[#ccfbf1] 
      dark:bg-gradient-to-r dark:from-[#0f172a] dark:to-[#334155]
      transition-colors duration-500 px-4"
    >
      <div className="mb-6">
        <Logo size={10} />
      </div>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Sign Up to your account</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </label>
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm font-bold dark:text-white text-black">
          Already signed up? <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
  )
}

export default SignUp
