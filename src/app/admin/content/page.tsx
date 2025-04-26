'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

interface Release {
  id: string;
  title: string;
  artist: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  genre: string;
  tracks: number;
}

export default function ContentReviewPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock releases data
    const mockReleases: Release[] = [
      {
        id: '1',
        title: 'Summer Vibes',
        artist: 'John Doe',
        submittedAt: '2024-03-15',
        status: 'pending',
        genre: 'Pop',
        tracks: 12
      },
      {
        id: '2',
        title: 'Night Drive',
        artist: 'Jane Smith',
        submittedAt: '2024-03-14',
        status: 'pending',
        genre: 'Electronic',
        tracks: 8
      },
      {
        id: '3',
        title: 'Acoustic Sessions',
        artist: 'Bob Wilson',
        submittedAt: '2024-03-13',
        status: 'pending',
        genre: 'Acoustic',
        tracks: 6
      }
    ];

    setReleases(mockReleases);
    setLoading(false);
  }, []);

  const handleStatusChange = (releaseId: string, newStatus: 'approved' | 'rejected') => {
    setReleases(releases.map(release =>
      release.id === releaseId ? { ...release, status: newStatus } : release
    ));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Content Review</h1>
          <p className="mt-1 text-sm text-gray-500">Review and approve pending releases</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Pending Reviews: {releases.filter(r => r.status === 'pending').length}
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {releases.map((release) => (
              <div key={release.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{release.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">by {release.artist}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Genre: {release.genre}</p>
                      <p>Tracks: {release.tracks}</p>
                      <p>Submitted: {release.submittedAt}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleStatusChange(release.id, 'approved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      disabled={release.status !== 'pending'}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(release.id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      disabled={release.status !== 'pending'}
                    >
                      Reject
                    </button>
                  </div>
                </div>
                {release.status !== 'pending' && (
                  <div className="mt-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      release.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {release.status.charAt(0).toUpperCase() + release.status.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 