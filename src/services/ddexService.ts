import { Release, Track, Artist } from '@/types';

interface DDEXMessage {
  messageId: string;
  messageThreadId: string;
  messageSchemaVersionId: string;
  businessProfileId: string;
}

interface ResourceList {
  soundRecordings: Track[];
  images: string[];
}

interface ReleaseList {
  release: Release;
  dealList: any[];
}

// DDEX Party constants
const DDEX_PARTY = {
  ID: 'PA-DPIDA-2024090404-U',
  NAME: 'VIVI Distro',
  SCHEMA_VERSION: 'ern/411'
};

export const ddexService = {
  generateMessageHeader(): DDEXMessage {
    return {
      messageId: `MSG-${Date.now()}`,
      messageThreadId: `THR-${Date.now()}`,
      messageSchemaVersionId: DDEX_PARTY.SCHEMA_VERSION,
      businessProfileId: 'MusicDistributionProfile'
    };
  },

  generateResourceList(release: Release): string {
    const resources = release.tracks.map(track => `
      <SoundRecording>
        <SoundRecordingType>MusicalWorkSoundRecording</SoundRecordingType>
        <SoundRecordingId>
          <ISRC>${track.isrc || ''}</ISRC>
        </SoundRecordingId>
        <ResourceReference>A${track.id}</ResourceReference>
        <ReferenceTitle>
          <TitleText>${this.escapeXml(track.title)}</TitleText>
        </ReferenceTitle>
        <Duration>PT${Math.floor(track.duration / 60)}M${track.duration % 60}S</Duration>
        <SoundRecordingDetailsByTerritory>
          <TerritoryCode>Worldwide</TerritoryCode>
          <Title>
            <TitleText>${this.escapeXml(track.title)}</TitleText>
          </Title>
          <DisplayArtist>
            ${track.artists.map(artist => `
              <PartyName>
                <FullName>${this.escapeXml(artist.name)}</FullName>
              </PartyName>
              <ArtistRole>${artist.roles[0]}</ArtistRole>
            `).join('')}
          </DisplayArtist>
          <LabelName>${this.escapeXml(release.label)}</LabelName>
          <PLine>
            <Year>${new Date().getFullYear()}</Year>
            <PLineText>(P) ${release.label}</PLineText>
          </PLine>
          <Genre>
            <GenreText>${this.escapeXml(release.genre)}</GenreText>
          </Genre>
          <ParentalWarningType>${track.explicit ? 'Explicit' : 'None'}</ParentalWarningType>
        </SoundRecordingDetailsByTerritory>
      </SoundRecording>
    `).join('');

    return `
      <ResourceList>${resources}</ResourceList>
    `;
  },

  generateReleaseList(release: Release): string {
    return `
      <ReleaseList>
        <Release>
          <ReleaseId>
            <GRid>${release.id}</GRid>
            <ICPN>${release.upc || ''}</ICPN>
          </ReleaseId>
          <ReleaseReference>R${release.id}</ReleaseReference>
          <ReferenceTitle>
            <TitleText>${this.escapeXml(release.title)}</TitleText>
          </ReferenceTitle>
          <ReleaseType>${release.type}</ReleaseType>
          <ReleaseDetailsByTerritory>
            <TerritoryCode>Worldwide</TerritoryCode>
            <DisplayArtistName>${this.escapeXml(release.artists[0].name)}</DisplayArtistName>
            <LabelName>${this.escapeXml(release.label)}</LabelName>
            <Title>
              <TitleText>${this.escapeXml(release.title)}</TitleText>
            </Title>
            <DisplayArtist>
              ${release.artists.map(artist => `
                <PartyName>
                  <FullName>${this.escapeXml(artist.name)}</FullName>
                </PartyName>
                <ArtistRole>${artist.roles[0]}</ArtistRole>
              `).join('')}
            </DisplayArtist>
          </ReleaseDetailsByTerritory>
          <PLine>
            <Year>${new Date().getFullYear()}</Year>
            <PLineText>(P) ${release.label}</PLineText>
          </PLine>
          <CLine>
            <Year>${new Date().getFullYear()}</Year>
            <CLineText>(C) ${release.label}</CLineText>
          </CLine>
          <Genre>
            <GenreText>${this.escapeXml(release.genre)}</GenreText>
          </Genre>
          <ReleaseDate>${new Date(release.releaseDate).toISOString().split('T')[0]}</ReleaseDate>
          <ParentalWarningType>${release.tracks.some(t => t.explicit) ? 'Explicit' : 'None'}</ParentalWarningType>
        </Release>
      </ReleaseList>
    `;
  },

  generateDealList(release: Release): string {
    return `
      <DealList>
        <ReleaseDeal>
          <DealReleaseReference>R${release.id}</DealReleaseReference>
          <Deal>
            <DealTerms>
              <CommercialModelType>PayAsYouGoModel</CommercialModelType>
              <Usage>
                <UseType>OnDemandStream</UseType>
                <UseType>PermanentDownload</UseType>
              </Usage>
              <TerritoryCode>Worldwide</TerritoryCode>
              <ValidityPeriod>
                <StartDate>${new Date(release.releaseDate).toISOString().split('T')[0]}</StartDate>
              </ValidityPeriod>
            </DealTerms>
          </Deal>
        </ReleaseDeal>
      </DealList>
    `;
  },

  generateERN(release: Release): string {
    const header = this.generateMessageHeader();
    const resourceList = this.generateResourceList(release);
    const releaseList = this.generateReleaseList(release);
    const dealList = this.generateDealList(release);

    return `<?xml version="1.0" encoding="UTF-8"?>
      <ern:NewReleaseMessage xmlns:ern="http://ddex.net/xml/ern/411" 
                            xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"
                            messageSchemaVersionId="${header.messageSchemaVersionId}">
        <MessageHeader>
          <MessageId>${header.messageId}</MessageId>
          <MessageThreadId>${header.messageThreadId}</MessageThreadId>
          <MessageSender>
            <PartyId>${DDEX_PARTY.ID}</PartyId>
            <PartyName>
              <FullName>${DDEX_PARTY.NAME}</FullName>
            </PartyName>
          </MessageSender>
          <MessageRecipient>
            <PartyId>DIGITAL_SERVICE</PartyId>
          </MessageRecipient>
          <MessageCreatedDateTime>${new Date().toISOString()}</MessageCreatedDateTime>
          <MessageControlType>LiveMessage</MessageControlType>
        </MessageHeader>
        ${resourceList}
        ${releaseList}
        ${dealList}
      </ern:NewReleaseMessage>
    `;
  },

  escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  },

  async validateDDEX(xml: string): Promise<boolean> {
    // In a production environment, this would validate against the DDEX schema
    // For now, we'll do basic XML validation
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'application/xml');
      const parserErrors = doc.getElementsByTagName('parsererror');
      return parserErrors.length === 0;
    } catch (error) {
      console.error('DDEX validation error:', error);
      return false;
    }
  },

  async distributeToStores(release: Release): Promise<void> {
    try {
      const ddexMessage = this.generateERN(release);
      const isValid = await this.validateDDEX(ddexMessage);
      
      if (!isValid) {
        throw new Error('Invalid DDEX message');
      }

      // In a production environment, this would send the DDEX message to various stores
      // For now, we'll just log it
      console.log('Generated DDEX message:', ddexMessage);
      
      // Update release status
      release.status = 'Distributed';
      
      // Save to local storage
      const releases = JSON.parse(localStorage.getItem('releases') || '[]');
      const updatedReleases = releases.map((r: Release) => 
        r.id === release.id ? release : r
      );
      localStorage.setItem('releases', JSON.stringify(updatedReleases));
      
    } catch (error) {
      console.error('Error distributing to stores:', error);
      throw error;
    }
  }
}; 