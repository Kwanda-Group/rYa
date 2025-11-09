import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal : true}),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb+srv://manzialpe:gloire@cluster0.beqtnkj.mongodb.net/?appName=Cluster0')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
