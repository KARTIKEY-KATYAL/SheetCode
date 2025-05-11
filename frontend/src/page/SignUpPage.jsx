import React , {useState} from 'react'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Link } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import Logo from '../components/Logo';
import {z} from "zod";
import AuthImagePattern from '../components/AuthImagePattern';
import { useAuthStore } from "../store/useAuthStore";

const SignUpSchema = z.object({
  email:z.string().email("Enter a valid email"),
  password:z.string().min(6 , "Password must be atleast of 6 characters"),
  name:z.string().min(3 , "Name must be atleast 3 character")
})

const SignUpPage = () => {

  const [showPassword , setShowPassword] = useState(false);

  const {signup , isSigningUp} = useAuthStore()

  const {
    register,
    handleSubmit,
    formState:{errors},
  } = useForm({
    resolver:zodResolver(SignUpSchema)
  })

  const onSubmit = async (data)=>{
   try {
    await signup(data)
    console.log("signup data" , data)
   } catch (error) {
     console.error("SignUp failed:", error);
   }
  }


  return (
    <div className="flex flex-col w-full lg:flex-row min-h-screen">
          {/* Signup Form Section */}
          <div className="w-full flex flex-col items-center justify-center 
            bg-gradient-to-bl from-[#ffe4e6] to-[#ccfbf1] 
            dark:bg-gradient-to-r dark:from-[#0f172a] dark:to-[#334155]
            transition-colors duration-500 p-4 py-8"
          >
            <div className="mb-6 lg:mb-8">
              <Logo size={8} />
            </div>
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-300 dark:border-gray-700">
              <h2 className="text-xl lg:text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                Create your account
              </h2>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm">{errors.name.message}</span>
                  )}
                </div>
    
                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">{errors.email.message}</span>
                  )}
                </div>
    
                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-base-content/40" />
                      ) : (
                        <Eye className="h-5 w-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-red-500 text-sm">{errors.password.message}</span>
                  )}
                </div>
    
                {/* Submit */}
                <button
                  type="submit"
                  className={`mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold py-2 px-4 rounded-md transition-colors duration-200
                    ${isSigningUp ? "bg-blue-800 hover:bg-blue-800 opacity-80 cursor-not-allowed" : ""}`}
                  disabled={isSigningUp}
                >
                  {isSigningUp ? (
                    <div className="flex gap-3 justify-center items-center">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>
    
              {/* Login Link */}
              <p className="mt-6 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline font-bold">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
  )
}

export default SignUpPage