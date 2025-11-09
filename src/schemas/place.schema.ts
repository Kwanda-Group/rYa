import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type PlaceDocument = Place & Document;

export enum PlaceType {
  TABLE = 'table',
  ROOM = 'room',
}

@Schema({ timestamps: true })
export class Place extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
  })
  restaurantId?: Types.ObjectId; // optional for hotel rooms

  @Prop({
    type: Types.ObjectId,
    ref: 'Hotel',
  })
  hotelId?: Types.ObjectId; // optional for tables

  @Prop({
    type: String,
    required: true,
    enum: PlaceType,
  })
  type: PlaceType;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  number: number;

  @Prop({
    type: String,
    required: true,
  })
  qrSlug: string;

  @Prop({
    type: String,
    required: true,
  })
  qrContentUrl: string;

  @Prop({
    type: String,
    required: true,
  })
  qrImageUrl: string;

  @Prop({
    type: Date,
    default: () => new Date(),
  })
  qrGeneratedAt: Date;

  @Prop({
    type: Date,
    default: null,
  })
  qrExpiresAt: Date | null;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);

// Indexes
PlaceSchema.index({ restaurantId: 1, number: 1, type: 1 }, { unique: true, sparse: true });
PlaceSchema.index({ hotelId: 1, number: 1, type: 1 }, { unique: true, sparse: true });
PlaceSchema.index({ qrSlug: 1 }, { unique: true });
