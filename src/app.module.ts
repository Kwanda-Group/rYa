import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import your feature modules
import { AuthModule } from './AdminModule/auth.module';
import { MenuModule } from './MenuModule/menu.module';
import { OrdersModule } from './OrdersModule/orders.module';
import { PlaceModule } from './TableModule/place.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URL ||
        'mongodb+srv://manzialpe:gloire@cluster0.beqtnkj.mongodb.net/?appName=Cluster0',
    ),

    // Feature modules
    AuthModule,
    MenuModule,
    OrdersModule,
    PlaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
