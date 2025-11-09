import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose"


export type MenuDocument = Menu & Document

@Schema({collection:"menu",timestamps: true})
export class Menu {
    @Prop({required:true , unique:true})
    name : string

    @Prop({ref:"Company" , type:mongoose.Types.ObjectId , })
    restaurant : string

    @Prop({required: true})
    description : string

    @Prop({required : true})
    price : number

    @Prop({required:true})
    imageUrl : string

    @Prop({required:true})
    category : 'drinks' | 'main' | 'deserts'

    @Prop({default: Date.now})
    createdAt : Date

    @Prop({default:Date.now})
    updatedAt : Date

}

export const MenuSchema = SchemaFactory.createForClass(Menu)

