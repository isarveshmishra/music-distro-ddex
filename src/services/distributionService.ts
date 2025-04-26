import { Distribution, Release, DistributionPlatform } from '@/types';
import { ddexService } from './ddexService';

const DISTRIBUTIONS_KEY = 'music_distributions';

// Platform-specific DDEX Party IDs
const PLATFORM_PARTY_IDS = {
  Spotify: 'SPOTIFY',
  AppleMusic: 'ITUNES',
  Amazon: 'AMAZONMUSIC',
  Deezer: 'DEEZER',
  YouTube: 'YOUTUBE'
};

// Platform-specific delivery requirements
const PLATFORM_REQUIREMENTS = {
  Spotify: {
    audioFormats: ['WAV', 'FLAC'],
    minBitrate: 16,
    minSampleRate: 44100,
    artworkSize: 3000
  },
  AppleMusic: {
    audioFormats: ['WAV', 'AIFF'],
    minBitrate: 16,
    minSampleRate: 44100,
    artworkSize: 3000
  },
  Amazon: {
    audioFormats: ['FLAC'],
    minBitrate: 16,
    minSampleRate: 44100,
    artworkSize: 3000
  },
  Deezer: {
    audioFormats: ['FLAC', 'WAV'],
    minBitrate: 16,
    minSampleRate: 44100,
    artworkSize: 3000
  },
  YouTube: {
    audioFormats: ['WAV', 'FLAC'],
    minBitrate: 16,
    minSampleRate: 44100,
    artworkSize: 3000
  }
};

export const distributionService = {
  getAllDistributions(): Distribution[] {
    const distributions = localStorage.getItem(DISTRIBUTIONS_KEY);
    return distributions ? JSON.parse(distributions) : [];
  },

  getDistributionsByRelease(releaseId: string): Distribution[] {
    return this.getAllDistributions().filter(dist => dist.releaseId === releaseId);
  },

  validatePlatformRequirements(release: Release, platform: string): string[] {
    const errors: string[] = [];
    const requirements = PLATFORM_REQUIREMENTS[platform as keyof typeof PLATFORM_REQUIREMENTS];

    release.tracks.forEach((track, index) => {
      const format = track.audioFile.format.toUpperCase();
      if (!requirements.audioFormats.includes(format)) {
        errors.push(`Track ${index + 1}: Audio format ${format} not supported by ${platform}. Supported formats: ${requirements.audioFormats.join(', ')}`);
      }

      // Add more platform-specific validations here
      // For example: bitrate, sample rate, artwork size, etc.
    });

    return errors;
  },

  async createDistribution(release: Release, platforms: string[]): Promise<Distribution> {
    // Validate release is ready for distribution
    if (release.status !== 'Approved') {
      throw new Error('Release must be approved before distribution');
    }

    // Validate platform requirements
    const validationErrors: { platform: string; errors: string[] }[] = [];
    platforms.forEach(platform => {
      const errors = this.validatePlatformRequirements(release, platform);
      if (errors.length > 0) {
        validationErrors.push({ platform, errors });
      }
    });

    if (validationErrors.length > 0) {
      throw new Error(
        'Platform requirements not met:\n' +
        validationErrors.map(({ platform, errors }) =>
          `${platform}:\n${errors.map(e => `- ${e}`).join('\n')}`
        ).join('\n\n')
      );
    }

    // Create distribution platforms array
    const distributionPlatforms: DistributionPlatform[] = platforms.map(platform => ({
      platform: platform as DistributionPlatform['platform'],
      status: 'Pending'
    }));

    // Create new distribution
    const newDistribution: Distribution = {
      id: Date.now().toString(),
      releaseId: release.id,
      platforms: distributionPlatforms,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      // Generate DDEX message for each platform
      await Promise.all(platforms.map(async platform => {
        const ddexMessage = await ddexService.generateERN(release);
        const isValid = await ddexService.validateDDEX(ddexMessage);

        if (!isValid) {
          throw new Error(`Invalid DDEX message for ${platform}`);
        }

        // In production, this would:
        // 1. Upload audio files to CDN with platform-specific transcoding
        // 2. Generate artwork in required formats
        // 3. Send DDEX message to platform-specific endpoint
        // 4. Track delivery status

        // For demo, simulate platform-specific processing time
        const processingTime = Math.random() * 3000 + 2000; // 2-5 seconds
        setTimeout(() => {
          this.updatePlatformStatus(
            newDistribution.id,
            platform as DistributionPlatform['platform'],
            'Complete',
            `https://${platform.toLowerCase()}.com/track/${release.id}`
          );

          // Update overall status if all platforms are complete
          const dist = this.getAllDistributions().find(d => d.id === newDistribution.id);
          if (dist && dist.platforms.every(p => p.status === 'Complete')) {
            this.updateDistributionStatus(newDistribution.id, 'Complete');
          }
        }, processingTime);
      }));

      // Save distribution
      const distributions = this.getAllDistributions();
      distributions.push(newDistribution);
      localStorage.setItem(DISTRIBUTIONS_KEY, JSON.stringify(distributions));

      return newDistribution;
    } catch (error) {
      console.error('Distribution creation error:', error);
      throw error;
    }
  },

  updateDistributionStatus(id: string, status: Distribution['status']): void {
    const distributions = this.getAllDistributions();
    const index = distributions.findIndex(dist => dist.id === id);
    
    if (index === -1) {
      throw new Error('Distribution not found');
    }

    distributions[index] = {
      ...distributions[index],
      status,
      updatedAt: new Date()
    };

    localStorage.setItem(DISTRIBUTIONS_KEY, JSON.stringify(distributions));
  },

  updatePlatformStatus(
    distributionId: string, 
    platform: DistributionPlatform['platform'], 
    status: DistributionPlatform['status'],
    url?: string
  ): void {
    const distributions = this.getAllDistributions();
    const index = distributions.findIndex(dist => dist.id === distributionId);
    
    if (index === -1) {
      throw new Error('Distribution not found');
    }

    const platformIndex = distributions[index].platforms.findIndex(p => p.platform === platform);
    
    if (platformIndex === -1) {
      throw new Error('Platform not found in distribution');
    }

    distributions[index].platforms[platformIndex] = {
      ...distributions[index].platforms[platformIndex],
      status,
      url
    };

    distributions[index].updatedAt = new Date();
    localStorage.setItem(DISTRIBUTIONS_KEY, JSON.stringify(distributions));
  },

  getDeliveryStatus(distributionId: string): {
    overall: Distribution['status'];
    platforms: DistributionPlatform[];
  } {
    const distribution = this.getAllDistributions().find(dist => dist.id === distributionId);
    
    if (!distribution) {
      throw new Error('Distribution not found');
    }

    return {
      overall: distribution.status,
      platforms: distribution.platforms
    };
  }
}; 