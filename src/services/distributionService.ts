import { Distribution, Release, DistributionPlatform } from '@/types';
import { ddexService } from './ddexService';

const DISTRIBUTIONS_KEY = 'music_distributions';

export const distributionService = {
  getAllDistributions(): Distribution[] {
    const distributions = localStorage.getItem(DISTRIBUTIONS_KEY);
    return distributions ? JSON.parse(distributions) : [];
  },

  getDistributionsByRelease(releaseId: string): Distribution[] {
    return this.getAllDistributions().filter(dist => dist.releaseId === releaseId);
  },

  async createDistribution(release: Release, platforms: string[]): Promise<Distribution> {
    // Validate release is ready for distribution
    if (release.status !== 'Approved') {
      throw new Error('Release must be approved before distribution');
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
      // Generate DDEX message
      const ddexMessage = await ddexService.generateERN(release);
      const isValid = await ddexService.validateDDEX(ddexMessage);

      if (!isValid) {
        throw new Error('Invalid DDEX message');
      }

      // In a production environment, this would:
      // 1. Upload audio files to CDN
      // 2. Generate artwork in required formats
      // 3. Send DDEX message to each platform
      // 4. Track delivery status
      
      // For demo purposes, we'll simulate successful delivery
      setTimeout(() => {
        this.updateDistributionStatus(newDistribution.id, 'Complete');
        distributionPlatforms.forEach(platform => {
          this.updatePlatformStatus(newDistribution.id, platform.platform, 'Complete');
        });
      }, 5000);

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