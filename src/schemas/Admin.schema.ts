import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose"

export type RestaurantDocument = Restaurant & Document

@Schema({collection :"restaurants",timestamps: true})
export class Restaurant {
    @Prop({required:true})
    name : string
    
    @Prop({required:true , unique:true})
    email : string

    @Prop({required:true})
    password:string

    @Prop()
    description?: string

    @Prop({required : true})
    location:string

    @Prop({required:true})
    logoUrl : string

    @Prop({default: Date.now})
    createdAt : Date

    @Prop({default:Date.now})
    updatedAt : Date

}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant)
RestaurantSchema.index({email : 1})
