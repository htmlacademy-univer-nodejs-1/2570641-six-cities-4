import axios from 'axios';
import { Offer, OfferCity, OfferConvenience, OfferType, UserType } from '../types/index.js';
import {
  getRandomBoolean,
  getRandomDate,
  getRandomFloat,
  getRandomInt,
  getRandomItem,
  getRandomItems
} from '../helpers/random.js';

type MockServerOffer = {
  id: number;
  title: string;
  description: string;
  publishDate: string;
  city: string;
  previewUrl: string;
  photosUrl: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  offerType: string;
  roomsCount: number;
  guestsCount: number;
  cost: number;
  conveiences: string[];
  author: {
    name: string;
    email: string;
    avatarUrl: string;
    password: string;
    userType: string;
  };
  commentsCount: number;
  coordinates: {
    lat: number;
    lon: number;
  };
};

export class MockOfferGenerator {
  private mockOffers: MockServerOffer[] = [];
  private cities: OfferCity[] = Object.values(OfferCity);
  private offerTypes: OfferType[] = Object.values(OfferType);
  private conveniences: OfferConvenience[] = Object.values(OfferConvenience);
  private userTypes: UserType[] = Object.values(UserType);

  constructor(private readonly mockServerUrl: string) {}

  public async loadMockData(): Promise<void> {
    try {
      const response = await axios.get(this.mockServerUrl);

      if (response.data && response.data.offers && Array.isArray(response.data.offers)) {
        // Format: { offers: [...] }
        this.mockOffers = response.data.offers;
      } else if (Array.isArray(response.data)) {
        // Format: [...]
        this.mockOffers = response.data;
      } else {
        throw new Error('Invalid response format from mock server');
      }

      if (this.mockOffers.length === 0) {
        throw new Error('No mock offers found in the server response');
      }

      console.log(`Loaded ${this.mockOffers.length} mock offers from server`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to load data from ${this.mockServerUrl}: ${error.message}`);
      }
      throw error;
    }
  }

  public generate(count: number): Offer[] {
    if (this.mockOffers.length === 0) {
      throw new Error('No mock data loaded. Call loadMockData() first.');
    }

    return Array.from({ length: count }, () => this.generateOffer());
  }

  private generateOffer(): Offer {
    const template = getRandomItem(this.mockOffers);
    const city = getRandomItem(this.cities);
    const offerType = getRandomItem(this.offerTypes);
    const userType = getRandomItem(this.userTypes);
    const coordinates = this.getCoordinatesForCity(city);
    const now = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(now.getFullYear() - 2);

    return {
      title: this.generateTitle(template.title, city),
      description: this.generateDescription(template.description, city),
      publishDate: getRandomDate(twoYearsAgo, now),
      city,
      previewUrl: template.previewUrl,
      photosUrl: template.photosUrl ? [...template.photosUrl] : ['https://via.placeholder.com/800x600'],
      isPremium: getRandomBoolean(0.3),
      isFavorite: getRandomBoolean(0.2),
      rating: getRandomFloat(1, 5, 1),
      offerType,
      roomsCount: getRandomInt(1, 6),
      guestsCount: getRandomInt(1, 10),
      cost: getRandomInt(5000, 500000),
      conveiences: getRandomItems(this.conveniences, getRandomInt(1, this.conveniences.length)),
      author: {
        name: template.author?.name || 'User',
        email: template.author?.email || `user${getRandomInt(1, 999)}@example.com`,
        avatarUrl: template.author?.avatarUrl || 'https://via.placeholder.com/100x100',
        password: template.author?.password || `password${getRandomInt(100, 999)}`,
        userType
      },
      commentsCount: getRandomInt(0, 15),
      coordinates
    };
  }

  private generateTitle(baseTitle: string, city: OfferCity): string {
    const titles = [
      `Cozy place in ${city}`,
      `Beautiful apartment in ${city}`,
      `Modern house in ${city}`,
      `Charming studio in ${city}`,
      `Luxury penthouse in ${city}`,
      `Historic building in ${city}`,
      `Central apartment in ${city}`,
      `Spacious flat in ${city}`,
      baseTitle?.replace(/в .*$/, `in ${city}`) || `Nice rental in ${city}`
    ];

    return getRandomItem(titles);
  }

  private generateDescription(baseDescription: string, city: OfferCity): string {
    const descriptions = [
      `${baseDescription || 'A perfect place for your stay'} Located in ${city}.`,
      `Wonderful place in the heart of ${city}. Great location and amenities.`,
      `Amazing view of ${city} from this property. Close to public transport.`,
      `Experience the authentic atmosphere of ${city} in this unique accommodation.`,
      `Perfect for both business and leisure trips to ${city}. Fully equipped and comfortable.`
    ];

    return getRandomItem(descriptions);
  }

  private getCoordinatesForCity(city: OfferCity): { lat: number; lon: number } {
    // Base coordinates for each city with some random variation
    const baseCoordinates = {
      [OfferCity.Paris]: { lat: 48.8566, lon: 2.3522 },
      [OfferCity.Cologne]: { lat: 50.9375, lon: 6.9603 },
      [OfferCity.Brussels]: { lat: 50.8503, lon: 4.3517 },
      [OfferCity.Amsterdam]: { lat: 52.3676, lon: 4.9041 },
      [OfferCity.Hamburg]: { lat: 53.5511, lon: 9.9937 },
      [OfferCity.Dusseldorf]: { lat: 51.2277, lon: 6.7735 }
    };

    const { lat, lon } = baseCoordinates[city];

    return {
      lat: getRandomFloat(lat - 0.02, lat + 0.02, 4),
      lon: getRandomFloat(lon - 0.02, lon + 0.02, 4)
    };
  }
}
