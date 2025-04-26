import { Release, Track } from '@/types';
import { ddexService } from './ddexService';

const RELEASES_KEY = 'music_releases';

export const releaseService = {
  getAllReleases(): Release[] {
    const releases = localStorage.getItem(RELEASES_KEY);
    return releases ? JSON.parse(releases) : [];
  },

  getReleaseById(id: string): Release | null {
    const releases = this.getAllReleases();
    return releases.find(release => release.id === id) || null;
  },

  createRelease(releaseData: Partial<Release>): Release {
    const releases = this.getAllReleases();
    
    const newRelease: Release = {
      id: Date.now().toString(),
      title: releaseData.title || '',
      artists: releaseData.artists || [],
      type: releaseData.type || 'Single',
      genre: releaseData.genre || '',
      releaseDate: releaseData.releaseDate || new Date(),
      label: releaseData.label || '',
      territories: releaseData.territories || ['Worldwide'],
      tracks: releaseData.tracks || [],
      status: 'Draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    releases.push(newRelease);
    localStorage.setItem(RELEASES_KEY, JSON.stringify(releases));
    return newRelease;
  },

  updateRelease(id: string, updateData: Partial<Release>): Release {
    const releases = this.getAllReleases();
    const index = releases.findIndex(release => release.id === id);
    
    if (index === -1) {
      throw new Error('Release not found');
    }

    const updatedRelease = {
      ...releases[index],
      ...updateData,
      updatedAt: new Date()
    };

    releases[index] = updatedRelease;
    localStorage.setItem(RELEASES_KEY, JSON.stringify(releases));
    return updatedRelease;
  },

  deleteRelease(id: string): void {
    const releases = this.getAllReleases();
    const filteredReleases = releases.filter(release => release.id !== id);
    localStorage.setItem(RELEASES_KEY, JSON.stringify(filteredReleases));
  },

  async distributeRelease(id: string): Promise<Release> {
    const release = this.getReleaseById(id);
    
    if (!release) {
      throw new Error('Release not found');
    }

    if (release.status !== 'Approved') {
      throw new Error('Release must be approved before distribution');
    }

    if (!release.tracks.length) {
      throw new Error('Release must have at least one track');
    }

    // Validate required fields
    if (!release.upc) {
      throw new Error('UPC is required for distribution');
    }

    if (!release.tracks.every(track => track.isrc)) {
      throw new Error('All tracks must have ISRC codes');
    }

    try {
      // Generate and send DDEX message
      await ddexService.distributeToStores(release);

      // Update release status
      const updatedRelease = this.updateRelease(id, {
        status: 'Distributed',
        updatedAt: new Date()
      });

      return updatedRelease;
    } catch (error) {
      console.error('Distribution error:', error);
      throw error;
    }
  },

  validateRelease(release: Release): string[] {
    const errors: string[] = [];

    if (!release.title) errors.push('Title is required');
    if (!release.artists.length) errors.push('At least one artist is required');
    if (!release.genre) errors.push('Genre is required');
    if (!release.label) errors.push('Label is required');
    if (!release.tracks.length) errors.push('At least one track is required');

    // Validate tracks
    release.tracks.forEach((track, index) => {
      if (!track.title) errors.push(`Track ${index + 1}: Title is required`);
      if (!track.artists.length) errors.push(`Track ${index + 1}: At least one artist is required`);
      if (!track.audioFile.url) errors.push(`Track ${index + 1}: Audio file is required`);
    });

    return errors;
  }
}; 