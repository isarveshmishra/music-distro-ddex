import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Welcome to Music Distribution Platform
        </h1>
        <p className="text-xl text-gray-600">
          Your global platform for music distribution and DDEX delivery
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:px-10 md:py-4 md:text-lg"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-100 px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200 md:px-10 md:py-4 md:text-lg"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
