'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Release } from '@/types';

const mockReleases: Release[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    artists: [{
      id: '1',
      name: 'John Doe',
      roles: ['Primary'],
      genres: ['Pop'],
      createdAt: new Date(),
      updatedAt: new Date()
    }],
    releaseDate: new Date('2024-06-15'),
    type: 'Single',
    status: 'Draft',
    genre: 'Pop',
    label: 'Example Label',
    territories: ['Worldwide'],
    tracks: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Midnight Tales',
    artists: [{
      id: '2',
      name: 'Jane Smith',
      roles: ['Primary'],
      genres: ['Electronic'],
      createdAt: new Date(),
      updatedAt: new Date()
    }],
    releaseDate: new Date('2024-07-01'),
    type: 'Album',
    status: 'Pending',
    genre: 'Electronic',
    label: 'Example Label',
    territories: ['Worldwide'],
    tracks: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Urban Dreams',
    artists: [{
      id: '3',
      name: 'Mike Johnson',
      roles: ['Primary'],
      genres: ['Hip Hop'],
      createdAt: new Date(),
      updatedAt: new Date()
    }],
    releaseDate: new Date('2024-05-30'),
    type: 'EP',
    status: 'Draft',
    genre: 'Hip Hop',
    label: 'Example Label',
    territories: ['Worldwide'],
    tracks: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function ReleasesPage() {
  const router = useRouter();
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRelease, setExpandedRelease] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'tracks' | 'distribution' | 'errors'>('details');

  useEffect(() => {
    // Check authentication
    const currentUser = userService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Load releases
    const loadReleases = async () => {
      try {
        setLoading(true);
        // Mock data for now
        const mockReleases: Release[] = [
          {
            id: '1',
            title: 'First Release',
            status: 'Draft',
            artists: [{
              id: '1',
              name: 'Artist 1',
              roles: ['Primary'],
              genres: ['Pop'],
              createdAt: new Date(),
              updatedAt: new Date()
            }],
            releaseDate: new Date('2024-03-20'),
            type: 'Album',
            genre: 'Pop',
            label: 'Example Label',
            territories: ['Worldwide'],
            tracks: [],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '2',
            title: 'Second Release',
            status: 'Pending',
            artists: [{
              id: '2',
              name: 'Artist 2',
              roles: ['Primary'],
              genres: ['Rock'],
              createdAt: new Date(),
              updatedAt: new Date()
            }],
            releaseDate: new Date('2024-03-21'),
            type: 'Single',
            genre: 'Rock',
            label: 'Example Label',
            territories: ['Worldwide'],
            tracks: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        setReleases(mockReleases);
      } catch (error) {
        console.error('Error loading releases:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReleases();
  }, [router]);

  const handleDistribute = async (releaseId: string) => {
    try {
      // Update the release in mock data
      const updatedRelease = mockReleases.find(r => r.id === releaseId);
      if (updatedRelease) {
        updatedRelease.status = 'Pending';
        setReleases(releases.map(release => 
          release.id === releaseId ? updatedRelease : release
        ));
        alert('Release submitted for distribution!');
      }
    } catch (error) {
      console.error('Error distributing release:', error);
      alert('Failed to submit release for distribution. Please try again.');
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upcoming Releases</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and distribute your music releases</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/releases/new')}
            className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Release
          </button>
        </div>

        {/* Releases List */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Release Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {releases.map((release) => (
                <tr key={release.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{release.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {release.artists.find(a => a.roles.includes('Primary'))?.name || release.artists[0]?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {release.releaseDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{release.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${release.status === 'Distributed' ? 'bg-green-100 text-green-800' : 
                        release.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {release.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {releases.length === 0 && (
          <div className="mt-8 rounded-lg bg-white p-6 text-center shadow">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No releases</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new release.</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/dashboard/releases/new')}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Release
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 