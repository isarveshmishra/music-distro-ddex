import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Welcome to Music Distribution Platform
        </h1>
        <p className="text-xl text-gray-600">
          Your global platform for music distribution and DDEX delivery
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
} 