import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose"

export type CompanyDocument = Company & Document

@Schema({timestamps: true})
export class Company {
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

export const CompanySchema = SchemaFactory.createForClass(Company)
CompanySchema.index({email : 1})
