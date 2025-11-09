import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company, CompanyDocument } from "../schemas/Admin.schema"
import { SignupDto } from './signup.dto';
import { LoginDto } from './login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const exist = await this.companyModel.findOne({ email: dto.email }).exec();
    if (exist) throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const company = await this.companyModel.create({
      ...dto,
      password: hashed,
    }) as CompanyDocument; // cast here

    
    const token = this.generateToken((company._id as Types.ObjectId).toString());
    return { company, token };
  }

  async login(dto: LoginDto) {
    const company = await this.companyModel.findOne({ email: dto.email }).exec() as CompanyDocument;
    if (!company) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, company.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    
    const token = this.generateToken((company._id as Types.ObjectId).toString());
    return { company, token };
  }

  generateToken(companyId: string) {
    return this.jwtService.sign({ sub: companyId, role: 'company' });
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      return null;
    }
  }
}
