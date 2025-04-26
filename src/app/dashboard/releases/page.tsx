'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { releaseService } from '@/services/releaseService';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Release } from '@/types';

export default function ReleasesPage() {
  const router = useRouter();
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

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
        const releases = releaseService.getAllReleases();
        setReleases(releases);
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
      const updatedRelease = await releaseService.distributeRelease(releaseId);
      setReleases(releases.map(release => 
        release.id === releaseId ? updatedRelease : release
      ));
      alert('Release submitted for distribution!');
    } catch (error) {
      console.error('Error distributing release:', error);
      alert('Failed to distribute release. Please try again.');
    }
  };

  const handleDelete = async (releaseId: string) => {
    if (window.confirm('Are you sure you want to delete this release?')) {
      try {
        releaseService.deleteRelease(releaseId);
        setReleases(releases.filter(release => release.id !== releaseId));
        alert('Release deleted successfully!');
      } catch (error) {
        console.error('Error deleting release:', error);
        alert('Failed to delete release. Please try again.');
      }
    }
  };

  const getStatusBadgeColor = (status: Release['status']) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Distributed: 'bg-blue-100 text-blue-800'
    };
    return colors[status];
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Releases</h1>
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

        {releases.length === 0 ? (
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
        ) : (
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
                  <tr key={release.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{release.title}</div>
                      <div className="text-sm text-gray-500">{release.genre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {release.artists.find(a => a.roles.includes('Primary'))?.name || release.artists[0]?.name}
                      </div>
                      {release.artists.length > 1 && (
                        <div className="text-sm text-gray-500">+{release.artists.length - 1} more</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(release.releaseDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {release.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(release.status)}`}>
                        {release.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => router.push(`/dashboard/releases/${release.id}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/releases/${release.id}/edit`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      {release.status === 'Draft' && (
                        <button
                          onClick={() => handleDistribute(release.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Distribute
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(release.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 