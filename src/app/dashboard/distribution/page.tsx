'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Release, Distribution } from '@/types';
import { releaseService } from '@/services/releaseService';
import { distributionService } from '@/services/distributionService';

export default function DistributionPage() {
  const router = useRouter();
  const [releases, setReleases] = useState<Release[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const platforms = [
    { id: 'Spotify', name: 'Spotify', logo: '🎵' },
    { id: 'AppleMusic', name: 'Apple Music', logo: '🍎' },
    { id: 'Amazon', name: 'Amazon Music', logo: '📦' },
    { id: 'Deezer', name: 'Deezer', logo: '🎧' },
    { id: 'YouTube', name: 'YouTube Music', logo: '▶️' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const allReleases = releaseService.getAllReleases();
      const approvedReleases = allReleases.filter(release => release.status === 'Approved');
      const allDistributions = distributionService.getAllDistributions();
      
      setReleases(approvedReleases);
      setDistributions(allDistributions);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleDistribute = async (release: Release) => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    try {
      setLoading(true);
      const distribution = await distributionService.createDistribution(release, selectedPlatforms);
      setDistributions(prev => [...prev, distribution]);
      alert('Distribution process started!');
    } catch (error) {
      console.error('Distribution error:', error);
      alert('Failed to start distribution. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Complete: 'bg-green-100 text-green-800',
      Failed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.Pending;
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
          <h1 className="text-2xl font-bold text-gray-900">Distribution Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your music distribution to digital stores</p>
        </div>

        {/* Platform Selection */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Platforms</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {platforms.map(platform => (
              <button
                key={platform.id}
                onClick={() => handlePlatformToggle(platform.id)}
                className={`p-4 rounded-lg border ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                } transition-colors duration-200`}
              >
                <div className="text-2xl mb-2">{platform.logo}</div>
                <div className="text-sm font-medium">{platform.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Releases Ready for Distribution */}
        <div className="mb-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ready for Distribution</h2>
            <p className="mt-1 text-sm text-gray-500">Releases approved and ready to distribute</p>
          </div>

          <div className="divide-y divide-gray-200">
            {releases.map(release => (
              <div key={release.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{release.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    by {release.artists[0].name}
                    {release.artists.length > 1 && ` + ${release.artists.length - 1} more`}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {release.tracks.length} tracks • {release.type} • {release.genre}
                  </p>
                </div>
                <button
                  onClick={() => handleDistribute(release)}
                  disabled={loading}
                  className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Distribute
                </button>
              </div>
            ))}

            {releases.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No releases ready for distribution
              </div>
            )}
          </div>
        </div>

        {/* Distribution History */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Distribution History</h2>
            <p className="mt-1 text-sm text-gray-500">Track the status of your distributions</p>
          </div>

          <div className="divide-y divide-gray-200">
            {distributions.map(distribution => {
              const release = releases.find(r => r.id === distribution.releaseId);
              return (
                <div key={distribution.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {release?.title || 'Unknown Release'}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Distributed on {new Date(distribution.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(distribution.status)}`}>
                      {distribution.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {distribution.platforms.map(platform => (
                      <div
                        key={platform.platform}
                        className="p-3 rounded-lg border border-gray-200"
                      >
                        <div className="text-sm font-medium text-gray-900">{platform.platform}</div>
                        <div className={`mt-1 text-xs font-semibold ${getStatusColor(platform.status)}`}>
                          {platform.status}
                        </div>
                        {platform.url && (
                          <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            View on Platform →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {distributions.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No distributions yet
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 