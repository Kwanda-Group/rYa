import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Menu, MenuDocument } from 'src/schemas/menu.schema';
import { Model, Types } from 'mongoose';
import { CreateMenuDto } from './create-menu.dto';
import { UpdateMenuDto } from './update-menu.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name);

  constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {}

  async create(restaurantId: string, dto: CreateMenuDto): Promise<Menu> {
    const menu = await this.menuModel.create({
      ...dto,
      restaurant: restaurantId,
    });
    this.logger.log(`Created menu item ${dto.name} for restaurant ${restaurantId}`);
    return menu;
  }

  async update(menuId: string, dto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.menuModel.findByIdAndUpdate(menuId, dto, { new: true });
    if (!menu) throw new NotFoundException('Menu item not found');
    this.logger.log(`Updated menu item ${menuId}`);
    return menu;
  }

async delete(menuId: string): Promise<void> {
  const menu = await this.menuModel.findById(menuId);
  if (!menu) throw new NotFoundException('Menu item not found');

  // Remove image from filesystem if exists
  const imagePath = path.join(process.cwd(), menu.imageUrl);
  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

  
  await this.menuModel.findByIdAndDelete(menuId);

  this.logger.log(`Deleted menu item ${menuId}`);
}

  async listByRestaurant(restaurantId: string): Promise<Menu[]> {
    return this.menuModel.find({ restaurant: restaurantId }).sort({ createdAt: -1 }).lean();
  }

  async getById(menuId: string): Promise<Menu> {
    const menu = await this.menuModel.findById(menuId);
    if (!menu) throw new NotFoundException('Menu item not found');
    return menu;
  }
}
