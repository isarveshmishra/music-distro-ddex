export interface Artist {
  id: string;
  name: string;
  spotifyId?: string;
  appleId?: string;
  biography?: string;
  genres: string[];
  roles: ArtistRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Release {
  id: string;
  title: string;
  artists: Artist[];
  type: 'Album' | 'EP' | 'Single';
  genre: string;
  subgenre?: string;
  releaseDate: Date;
  label: string;
  upc?: string;
  territories: string[];
  tracks: Track[];
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Distributed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Track {
  id: string;
  title: string;
  artists: Artist[];
  releaseId: string;
  isrc?: string;
  duration: number;
  explicit: boolean;
  audioFile: {
    url: string;
    format: string;
    bitrate: number;
  };
  lyrics?: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: string;
  name: string;
  contactEmail: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Distribution {
  id: string;
  releaseId: string;
  platforms: DistributionPlatform[];
  status: 'Pending' | 'Processing' | 'Complete' | 'Failed';
  errors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DistributionPlatform {
  platform: 'Spotify' | 'AppleMusic' | 'Amazon' | 'Deezer' | 'YouTube';
  status: 'Pending' | 'Complete' | 'Failed';
  url?: string;
  error?: string;
}

export type ArtistRole = 'Primary' | 'Featured' | 'Producer' | 'Remixer' | 'Composer';

export interface Analytics {
  releaseId: string;
  platform: string;
  streams: number;
  revenue: number;
  period: string;
  territory: string;
} 