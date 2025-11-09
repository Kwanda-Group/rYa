import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as rateLimit from "express-rate-limit"
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //configure handling public files
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  
  //ENABLE CORS AND HEADERS HANDLING
  app.enableCors()
  app.use(helmet())

  // enable rate limiting
  app.use(rateLimit.default({
    windowMs:60 *1000,
    max : 100
  }))

  //handle global validation pipelines
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true
    })
  )
  app.listen(process.env.PORT || '5000' , ()=>console.log(`app listening on port:${process.env.PORT || '5000'}`))
}
bootstrap();
