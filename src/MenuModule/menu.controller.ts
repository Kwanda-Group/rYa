import { Controller, Post, Param, Body, Get, Patch, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './create-menu.dto';
import { UpdateMenuDto } from './update-menu.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs'
import { Multer } from 'multer'; 


@Controller('restaurant/:restaurantId/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // Upload menu image
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const restaurantId = req.params.restaurantId;
        const uploadPath = `uploads/menus/${restaurantId}`;
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return { imageUrl: `/uploads/menus/${file.filename}` };
}


  // Create menu item
  @Post()
  create(@Param('restaurantId') restaurantId: string, @Body() dto: CreateMenuDto) {
    return this.menuService.create(restaurantId, dto);
  }

  // Update menu item
  @Patch(':menuId')
  update(@Param('menuId') menuId: string, @Body() dto: UpdateMenuDto) {
    return this.menuService.update(menuId, dto);
  }

  // Delete menu item
  @Delete(':menuId')
  delete(@Param('menuId') menuId: string) {
    return this.menuService.delete(menuId);
  }

  // List menu items for restaurant
  @Get()
  list(@Param('restaurantId') restaurantId: string) {
    return this.menuService.listByRestaurant(restaurantId);
  }

  // Get single menu item
  @Get(':menuId')
  get(@Param('menuId') menuId: string) {
    return this.menuService.getById(menuId);
  }
}
