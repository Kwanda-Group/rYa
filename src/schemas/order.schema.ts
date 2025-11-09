import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Menu } from "./menu.schema";
import { Restaurant } from "./Admin.schema";

export type OrderDocument = Order & Document;

@Schema({collection:"orders" , timestamps:true})
export class Order {
    @Prop({required:true , type:mongoose.Types.ObjectId , ref:Restaurant.name})
    restaurant : mongoose.Types.ObjectId

    @Prop({required:true})
    tableNumber : number

    @Prop({
        type: [
            {
                menuItem : { required: true , type: mongoose.Schema.Types.ObjectId , ref: Menu.name},
                quantity : {required:true , type:Number}
            }
        ],
        required:true
    })
    items : {menuItem:mongoose.Types.ObjectId , quantity:number}[]

    @Prop({required:true , enum: ["pending", "preparing", "served", "cancelled"] , default:'pending'})
    status : "pending" | "preparing" | "served" | "cancelled";

    @Prop({default:Date.now})
    createdAt: Date
    
    @Prop({default:Date.now})
    updatedAt: Date
}

export const OrderShema = SchemaFactory.createForClass(Order)