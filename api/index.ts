import { NowRequest, NowResponse } from '@vercel/node'; 
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../src/modules/admin/all-exceptions.filter';
import { json, urlencoded } from 'body-parser';

export default async function handler(req: NowRequest, res: NowResponse) {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.init();

  const server = app.getHttpAdapter().getInstance();
  server(req, res);
}