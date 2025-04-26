import { Release } from '@/types';

const RELEASES_KEY = 'music_releases';

export const releaseService = {
  getAllReleases(): Release[] {
    const releases = localStorage.getItem(RELEASES_KEY);
    return releases ? JSON.parse(releases) : [];
  },

  getReleasesByUser(userId: string): Release[] {
    const releases = this.getAllReleases();
    return releases.filter(release => {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return user.role === 'admin' || release.label === user.label;
    });
  },

  createRelease(release: Partial<Release>): Release {
    const releases = this.getAllReleases();
    const newRelease: Release = {
      ...release,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'Draft',
    } as Release;

    releases.push(newRelease);
    localStorage.setItem(RELEASES_KEY, JSON.stringify(releases));
    return newRelease;
  },

  updateRelease(id: string, release: Partial<Release>): Release {
    const releases = this.getAllReleases();
    const index = releases.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Release not found');

    const updatedRelease = {
      ...releases[index],
      ...release,
      updatedAt: new Date()
    };

    releases[index] = updatedRelease;
    localStorage.setItem(RELEASES_KEY, JSON.stringify(releases));
    return updatedRelease;
  },

  deleteRelease(id: string): void {
    const releases = this.getAllReleases();
    const filteredReleases = releases.filter(r => r.id !== id);
    localStorage.setItem(RELEASES_KEY, JSON.stringify(filteredReleases));
  },

  distributeRelease(id: string): Release {
    const releases = this.getAllReleases();
    const index = releases.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Release not found');

    const updatedRelease: Release = {
      ...releases[index],
      status: 'Pending' as const,
      updatedAt: new Date()
    };

    releases[index] = updatedRelease;
    localStorage.setItem(RELEASES_KEY, JSON.stringify(releases));
    return updatedRelease;
  }
}; 