'use client';

import { Inter } from 'next/font/google'
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
})

import { Lexend } from 'next/font/google'
const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-lexend',
})

import { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      alert('Login attempt with: ' + username);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <img 
                src="/img/sta.rita_logo.png" 
                alt="Sta. Rita Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
            <h1 className={`${lexend.className} text-3xl font-bold text-gray-900`}>Welcome Back</h1>
            <p className={`${lexend.className} text-gray-500`}>Sign in to your tax system account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className={`${inter.className} block text-sm font-medium text-gray-700`}>
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className={`${inter.className} w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061e4a] focus:border-transparent`}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className={`${inter.className} block text-sm font-medium text-gray-700`}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inter.className} w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#061e4a] focus:border-transparent`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 border cursor-pointer border-gray-300 rounded focus:ring-2 focus:ring-[#061e4a]"
                />
                <span className={`${inter.className} text-sm text-gray-600 cursor-pointer`}>Remember me</span>
              </label>
              <a href="#" className={`${inter.className} text-sm text-[#061e4a] hover:text-[#061e4a]/80 font-medium`}>
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`${inter.className} w-full cursor-pointer bg-[#061e4a] hover:bg-[#061e4a]/90 disabled:bg-[#061e4a]/50 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2`}
            >
              <LogIn className={`w-5 h-5 ${inter.className}`} />
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2026 Tax System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
