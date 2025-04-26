import { Track, Artist } from '@/types';

const TRACKS_KEY = 'music_tracks';

export const trackService = {
  getAllTracks(): Track[] {
    const tracks = localStorage.getItem(TRACKS_KEY);
    return tracks ? JSON.parse(tracks) : [];
  },

  getTracksByArtist(artistId: string): Track[] {
    const tracks = this.getAllTracks();
    return tracks.filter(track => 
      track.artists.some(artist => artist.id === artistId)
    );
  },

  getTracksByRelease(releaseId: string): Track[] {
    const tracks = this.getAllTracks();
    return tracks.filter(track => track.releaseId === releaseId);
  },

  createTrack(trackData: Partial<Track>, artists: Artist[]): Track {
    const tracks = this.getAllTracks();
    
    const newTrack: Track = {
      id: Date.now().toString(),
      title: trackData.title || '',
      artists: artists,
      duration: trackData.duration || 0,
      explicit: trackData.explicit || false,
      position: trackData.position || 1,
      audioFile: trackData.audioFile || {
        url: '',
        format: 'mp3',
        bitrate: 320
      },
      createdAt: new Date(),
      updatedAt: new Date()
    } as Track;

    tracks.push(newTrack);
    localStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
    return newTrack;
  },

  updateTrack(id: string, trackData: Partial<Track>): Track {
    const tracks = this.getAllTracks();
    const index = tracks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Track not found');

    const updatedTrack = {
      ...tracks[index],
      ...trackData,
      updatedAt: new Date()
    };

    tracks[index] = updatedTrack;
    localStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
    return updatedTrack;
  },

  deleteTrack(id: string): void {
    const tracks = this.getAllTracks();
    const filteredTracks = tracks.filter(t => t.id !== id);
    localStorage.setItem(TRACKS_KEY, JSON.stringify(filteredTracks));
  },

  uploadAudio(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // In a real app, this would upload to a storage service
        // For now, we'll store as base64 in localStorage
        const base64Audio = reader.result as string;
        resolve(base64Audio);
      };
      reader.readAsDataURL(file);
    });
  }
}; 