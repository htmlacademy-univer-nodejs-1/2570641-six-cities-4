import { injectable, inject } from 'inversify';
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { LoggerInterface } from '../../shared/libs/logger/logger.interface.js';
import { types } from '../../shared/container/types.js';
import { DatabaseInterface } from '../../shared/libs/database/database.interface.js';
import { OfferServiceInterface } from '../../shared/modules/offer/offer-service.interface.js';
import { UserServiceInterface } from '../../shared/modules/user/user-service.interface.js';
import { Offer } from '../../shared/types/offer.type.js';
import { getURI } from '../../shared/helpers/database.js';
import { UserEntity } from '../../shared/modules/user/user.entity.js';
import { OfferEntity } from '../../shared/modules/offer/offer.entity.js';
import { UserType as UserTypeEntity } from '../../shared/modules/user/user-type.enum.js';
import { OfferType as OfferTypeEntity } from '../../shared/modules/offer/offer-type.enum.js';
import { City } from '../../shared/modules/offer/city.enum.js';
import { Amenity } from '../../shared/modules/offer/amenity.enum.js';
import { Ref } from '@typegoose/typegoose';

@injectable()
export class ImportCommand implements Command {
  constructor(
    @inject(types.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(types.DatabaseInterface) private readonly databaseClient: DatabaseInterface,
    @inject(types.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(types.UserServiceInterface) private readonly userService: UserServiceInterface
  ) {}

  public getName(): string {
    return '--import';
  }

  private createUser(offer: Offer) {
    return {
      name: offer.author.name,
      email: offer.author.email,
      avatar: offer.author.avatarUrl,
      password: offer.author.password,
      type: this.mapUserType(offer.author.userType)
    };
  }

  private mapUserType(userType: string): UserTypeEntity {
    if (userType === 'Pro') {
      return UserTypeEntity.Pro;
    }
    return UserTypeEntity.Regular;
  }

  private mapCity(city: string): City {
    const cityMap: Record<string, City> = {
      'Paris': City.Paris,
      'Cologne': City.Cologne,
      'Brussels': City.Brussels,
      'Amsterdam': City.Amsterdam,
      'Hamburg': City.Hamburg,
      'Dusseldorf': City.Dusseldorf
    };

    return cityMap[city] || City.Paris;
  }

  private mapOfferType(offerType: string): OfferTypeEntity {
    const typeMap: Record<string, OfferTypeEntity> = {
      'apartment': OfferTypeEntity.Apartment,
      'house': OfferTypeEntity.House,
      'room': OfferTypeEntity.Room,
      'hotel': OfferTypeEntity.Hotel
    };

    return typeMap[offerType.toLowerCase()] || OfferTypeEntity.Apartment;
  }

  private mapAmenities(amenities: string[]): Amenity[] {
    const amenityMap: Record<string, Amenity> = {
      'Breakfast': Amenity.Breakfast,
      'AirConditioning': Amenity.AirConditioning,
      'LaptopFriendlyWorkspace': Amenity.LaptopFriendlyWorkspace,
      'BabySeat': Amenity.BabySeat,
      'Washer': Amenity.Washer,
      'Towels': Amenity.Towels,
      'Fridge': Amenity.Fridge
    };

    return amenities.map((a) => amenityMap[a] || Amenity.Breakfast);
  }

  private createOffer(offer: Offer, userId: string): Omit<OfferEntity, '_id'> {
    return {
      title: offer.title,
      description: offer.description,
      date: offer.publishDate,
      city: this.mapCity(offer.city),
      previewImage: offer.previewUrl,
      images: offer.photosUrl,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: this.mapOfferType(offer.offerType),
      roomCount: offer.roomsCount,
      guestCount: offer.guestsCount,
      price: offer.cost,
      amenities: this.mapAmenities(offer.conveiences),
      userId: userId as unknown as Ref<UserEntity>,
      commentCount: offer.commentsCount,
      location: {
        latitude: offer.coordinates.lat,
        longitude: offer.coordinates.lon
      }
    };
  }

  public async execute(...parameters: string[]): Promise<void> {
    let databaseUri = '';
    let filename = '';

    if (parameters.length === 1) {
      // Single parameter - assuming it's the filename
      [filename] = parameters;
      databaseUri = 'mongodb://localhost:27017/six-cities';
    } else if (parameters.length >= 5) {
      // Multiple parameters for DB connection
      const [host, port, dbname, username, password, filenameArg] = parameters;
      databaseUri = getURI(host, port, dbname, username, password);
      filename = filenameArg || parameters[parameters.length - 1];
    } else {
      this.logger.error('Invalid parameters for import command. Provide either a filename or database connection parameters and filename.');
      return;
    }

    this.logger.info(`Import file: ${filename}`);
    this.logger.info(`Database URI: ${databaseUri}`);

    try {
      await this.databaseClient.connect(databaseUri);

      const fileReader = new TSVFileReader(filename);
      fileReader.read();
      const offers = fileReader.toArray();

      for (const offer of offers) {
        const userData = this.createUser(offer);
        const existingUser = await this.userService.findByEmail(userData.email);

        const userId = existingUser ?
          existingUser.id :
          (await this.userService.create({
            name: userData.name,
            email: userData.email,
            type: userData.type,
            avatar: userData.avatar,
            password: userData.password
          }, userData.password)).id;

        await this.offerService.create(this.createOffer(offer, userId));
      }

      this.logger.info(`${offers.length} offers imported successfully.`);
      await this.databaseClient.disconnect();
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`Import error: ${err.message}`);
      }
      await this.databaseClient.disconnect();
    }
  }
}
