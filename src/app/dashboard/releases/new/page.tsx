'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Release, Track, Artist } from '@/types';
import { releaseService } from '@/services/releaseService';
import { trackService } from '@/services/trackService';
import { userService } from '@/services/userService';

export default function NewReleasePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [release, setRelease] = useState<Partial<Release>>({
    title: '',
    type: 'Single',
    genre: '',
    releaseDate: new Date(),
    label: userService.getCurrentUser()?.label || '',
    territories: ['Worldwide'],
    tracks: [],
    status: 'Draft'
  });
  const [currentTrack, setCurrentTrack] = useState<Partial<Track>>({
    title: '',
    artists: [],
    explicit: false,
    position: 1
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTrack.title && currentTrack.artists?.length && audioFile) {
      try {
        // Upload audio file
        const audioUrl = await trackService.uploadAudio(audioFile);
        
        // Create track with audio file
        const newTrack: Partial<Track> = {
          ...currentTrack,
          audioFile: {
            url: audioUrl,
            format: audioFile.type.split('/')[1] || 'mp3',
            bitrate: 320
          },
          duration: 0 // In a real app, we would calculate this from the audio file
        };

        setRelease(prev => ({
          ...prev,
          tracks: [...(prev.tracks || []), newTrack as Track]
        }));

        // Reset form
        setCurrentTrack({
          title: '',
          artists: [],
          explicit: false,
          position: (release.tracks?.length || 0) + 2
        });
        setAudioFile(null);
      } catch (error) {
        console.error('Error uploading track:', error);
        alert('Failed to upload track. Please try again.');
      }
    } else {
      alert('Please fill in all required fields and upload an audio file.');
    }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      await releaseService.createRelease(release);
      router.push('/dashboard/releases');
    } catch (error) {
      console.error('Error creating release:', error);
      alert('Failed to create release. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Create New Release</h1>

        {/* Progress Steps */}
        <div className="mb-8 flex justify-between">
          {['Basic Info', 'Tracks', 'Review'].map((step, index) => (
            <div
              key={step}
              className={`flex items-center ${index + 1 === currentStep ? 'text-indigo-600' : 'text-gray-400'}`}
            >
              <div className={`h-8 w-8 rounded-full ${
                index + 1 === currentStep ? 'bg-indigo-600' : 'bg-gray-200'
              } flex items-center justify-center text-white`}>
                {index + 1}
              </div>
              <span className="ml-2">{step}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <form onSubmit={handleBasicInfoSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                value={release.title}
                onChange={(e) => setRelease({ ...release, title: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={release.type}
                onChange={(e) => setRelease({ ...release, type: e.target.value as Release['type'] })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="Single">Single</option>
                <option value="EP">EP</option>
                <option value="Album">Album</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Genre</label>
              <input
                type="text"
                required
                value={release.genre}
                onChange={(e) => setRelease({ ...release, genre: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Release Date</label>
              <input
                type="date"
                required
                value={new Date(release.releaseDate as Date).toISOString().split('T')[0]}
                onChange={(e) => setRelease({ ...release, releaseDate: new Date(e.target.value) })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Label</label>
              <input
                type="text"
                required
                value={release.label}
                onChange={(e) => setRelease({ ...release, label: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Next: Add Tracks
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Add Tracks */}
        {currentStep === 2 && (
          <div className="space-y-6 rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">Add Tracks</h2>
            
            {/* Track List */}
            {release.tracks && release.tracks.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">Added Tracks:</h3>
                <ul className="space-y-2">
                  {release.tracks.map((track, index) => (
                    <li key={index} className="rounded bg-gray-50 p-3">
                      {track.position}. {track.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add Track Form */}
            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Track Title</label>
                <input
                  type="text"
                  required
                  value={currentTrack.title}
                  onChange={(e) => setCurrentTrack({ ...currentTrack, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Artist Name</label>
                <input
                  type="text"
                  required
                  placeholder="Add primary artist"
                  onChange={(e) => {
                    const artist: Artist = {
                      id: Date.now().toString(),
                      name: e.target.value,
                      genres: [],
                      roles: ['Primary'],
                      createdAt: new Date(),
                      updatedAt: new Date()
                    };
                    setCurrentTrack({ ...currentTrack, artists: [artist] });
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Audio File</label>
                <input
                  type="file"
                  required
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={currentTrack.explicit}
                  onChange={(e) => setCurrentTrack({ ...currentTrack, explicit: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                <label className="ml-2 text-sm text-gray-700">Explicit Content</label>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  Back
                </button>
                <div className="space-x-2">
                  <button
                    type="submit"
                    className="rounded bg-indigo-100 px-4 py-2 text-indigo-700 hover:bg-indigo-200"
                  >
                    Add Track
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                    disabled={!release.tracks?.length}
                  >
                    Next: Review
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div className="space-y-6 rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">Review Release</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Basic Information</h3>
                <p>Title: {release.title}</p>
                <p>Type: {release.type}</p>
                <p>Genre: {release.genre}</p>
                <p>Release Date: {release.releaseDate ? new Date(release.releaseDate).toLocaleDateString() : ''}</p>
                <p>Label: {release.label}</p>
              </div>

              <div>
                <h3 className="font-medium">Tracks ({release.tracks?.length})</h3>
                <ul className="mt-2 space-y-2">
                  {release.tracks?.map((track, index) => (
                    <li key={index} className="rounded bg-gray-50 p-3">
                      {track.position}. {track.title} - {track.artists[0].name}
                      {track.explicit && <span className="ml-2 text-red-600">(Explicit)</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Back
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isLoading}
                className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Create Release'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 