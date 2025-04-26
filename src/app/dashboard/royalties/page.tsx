'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Analytics } from '@/types';

interface RoyaltyPeriod {
  period: string;
  totalRevenue: number;
  platforms: {
    name: string;
    revenue: number;
    streams: number;
  }[];
}

export default function RoyaltiesPage() {
  const [periods, setPeriods] = useState<RoyaltyPeriod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock royalty data
    const mockPeriods: RoyaltyPeriod[] = [
      {
        period: '2024-03',
        totalRevenue: 75.0,
        platforms: [
          {
            name: 'Spotify',
            revenue: 50.0,
            streams: 10000
          },
          {
            name: 'Apple Music',
            revenue: 25.0,
            streams: 5000
          }
        ]
      },
      {
        period: '2024-02',
        totalRevenue: 60.0,
        platforms: [
          {
            name: 'Spotify',
            revenue: 40.0,
            streams: 8000
          },
          {
            name: 'Apple Music',
            revenue: 20.0,
            streams: 4000
          }
        ]
      }
    ];

    setPeriods(mockPeriods);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const totalRevenue = periods.reduce((sum, period) => sum + period.totalRevenue, 0);
  const totalStreams = periods.reduce((sum, period) => 
    sum + period.platforms.reduce((pSum, platform) => pSum + platform.streams, 0), 0
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Royalties</h1>
          <p className="mt-1 text-sm text-gray-500">Track your earnings across all platforms</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Total Earnings</h2>
            <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Total Streams</h2>
            <p className="text-3xl font-bold text-indigo-600">{totalStreams.toLocaleString()}</p>
          </div>
        </div>

        {periods.map((period, index) => (
          <div key={index} className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                Period: {period.period}
                <span className="ml-4 text-green-600">${period.totalRevenue.toFixed(2)}</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streams</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {period.platforms.map((platform, pIndex) => (
                    <tr key={pIndex} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{platform.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{platform.streams.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${platform.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
} 