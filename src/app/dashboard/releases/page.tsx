'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Release } from '@/types';

export default function ReleasesPage() {
  const router = useRouter();
  const [releases, setReleases] = useState<Release[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // TODO: Fetch releases from API
    // For now, using mock data
    const mockReleases: Release[] = [
      {
        id: '1',
        title: 'Summer Vibes',
        artists: [{ id: '1', name: 'DJ Cool', genres: [], roles: ['Primary'], createdAt: new Date(), updatedAt: new Date() }],
        type: 'Album',
        genre: 'Electronic',
        releaseDate: new Date('2024-06-01'),
        label: 'Cool Records',
        territories: ['Worldwide'],
        tracks: [],
        status: 'Draft',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    setReleases(mockReleases);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Releases</h1>
          <button
            onClick={() => router.push('/dashboard/releases/new')}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Create New Release
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {releases.map((release) => (
            <div key={release.id} className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-2 text-xl font-semibold">{release.title}</h3>
              <div className="mb-4 text-sm text-gray-500">
                <p>Type: {release.type}</p>
                <p>Genre: {release.genre}</p>
                <p>Release Date: {new Date(release.releaseDate).toLocaleDateString()}</p>
                <p>Status: <span className="rounded bg-yellow-100 px-2 py-1 text-yellow-800">{release.status}</span></p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => router.push(`/dashboard/releases/${release.id}`)}
                  className="rounded bg-indigo-100 px-4 py-2 text-indigo-700 hover:bg-indigo-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => router.push(`/dashboard/releases/${release.id}/distribute`)}
                  className="rounded bg-green-100 px-4 py-2 text-green-700 hover:bg-green-200"
                >
                  Distribute
                </button>
              </div>
            </div>
          ))}
        </div>

        {releases.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500">No releases found. Create your first release to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
} 