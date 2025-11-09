import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Menu } from "./menu.schema";
import { PlaceType } from "./place.schema";

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  SERVED = "served",
  CANCELLED = "cancelled",
}

@Schema({ collection: "orders", timestamps: true })
export class Order {
  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: "Company" })
  restaurant: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: "Hotel" })
  hotel?: mongoose.Types.ObjectId; // optional for room orders

  @Prop({ type: Number, required: true })
  placeNumber: number; // table number or room number

  @Prop({ required: true, enum: ["table", "room"] })
  placeType: PlaceType;

  @Prop({
    type: [
      {
        menuItem: { required: true, type: mongoose.Schema.Types.ObjectId, ref: Menu.name },
        quantity: { required: true, type: Number },
      },
    ],
    required: true,
  })
  items: { menuItem: mongoose.Types.ObjectId; quantity: number }[];

  @Prop({ required: true, enum: Object.values(OrderStatus), default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ type: Number, default: 15 }) // estimated minutes to prepare
  etaMinutes: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
