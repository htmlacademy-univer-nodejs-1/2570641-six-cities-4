import { Coordinates } from './coordinates.type.js';
import { OfferCity } from './offer-city.enum.type.js';
import { OfferConvenience } from './offer-convenience.enum.type.js';
import { OfferType } from './offer-type.enum.type.js';
import { User } from './user.type.js';

export type Offer = {
    title: string;
    description: string;
    publishDate: Date;
    city: OfferCity;
    previewUrl: string;
    photosUrl: string[];
    isPremium: boolean;
    isFavorite: boolean;
    rating: number;
    offerType: OfferType;
    roomsCount: number;
    guestsCount: number;
    cost: number;
    conveiences: OfferConvenience[];
    author: User;
    commentsCount: number;
    coordinates: Coordinates;
}
