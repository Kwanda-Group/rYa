import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Restaurant } from './Admin.schema';

@Schema({ timestamps: true })
export class Table extends Document {

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: Restaurant.name,
  })
  restaurantId: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  number: number;

  // Slug uniquely used inside QR codes
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  qrSlug: string;

  // The URL the QR actually points to
  @Prop({
    type: String,
    required: true,
  })
  qrContentUrl: string;

  // URL where QR image is stored (PNG or SVG)
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

export const TableSchema = SchemaFactory.createForClass(Table);

// Indexes
TableSchema.index({ restaurantId: 1, number: 1 }, { unique: true });
TableSchema.index({ qrSlug: 1 }, { unique: true });
