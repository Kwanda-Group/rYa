import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as fs from 'fs';
import * as QRCode from 'qrcode';
import { Model } from "mongoose";
import path from "path";
import { Place, PlaceType } from "src/schemas/place.schema";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlaceService {
  private readonly logger = new Logger(PlaceService.name);

  constructor(@InjectModel(Place.name) private placeModel: Model<Place>) {}

  async create(
    type: PlaceType,
    number: number,
    restaurantId?: string,
    hotelId?: string,
  ) {
    // Ensure unique place per restaurant or hotel
    const filter: any = { type, number };
    if (type === PlaceType.TABLE) filter.restaurantId = restaurantId;
    if (type === PlaceType.ROOM) filter.hotelId = hotelId;

    const exist = await this.placeModel.findOne(filter).lean();
    if (exist) throw new BadRequestException(`${type} number already exists`);

    const slug = uuidv4().slice(0, 8);
    const qrContentUrl = `${process.env.FRONTEND_URL || 'https://rya.example.com'}/r/${slug}`;

    const uploadDir = path.join(
      process.cwd(),
      'uploads',
      restaurantId || hotelId || 'unknown'
    );
    fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `${type}-${number}-${Date.now()}.png`;
    const filePath = path.join(uploadDir, filename);

    await QRCode.toFile(filePath, qrContentUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 600,
    });

    const qrImageUrl = `/uploads/${restaurantId || hotelId}/${filename}`;

    const doc = await this.placeModel.create({
      type,
      number,
      restaurantId,
      hotelId,
      qrSlug: slug,
      qrContentUrl,
      qrImageUrl,
      qrGeneratedAt: new Date(),
    });

    this.logger.log(`Created ${type} ${number}, QR saved: ${filePath}`);
    return doc;
  }

  async findBySlug(slug: string) {
    return this.placeModel.findOne({ qrSlug: slug }).lean();
  }

  async listForRestaurant(restaurantId: string) {
    return this.placeModel.find({ restaurantId }).lean();
  }

  async listForHotel(hotelId: string) {
    return this.placeModel.find({ hotelId }).lean();
  }
}
