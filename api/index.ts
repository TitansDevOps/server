import 'module-alias/register';
require('module-alias').addAliases({
  '@modules': __dirname + '/../src/modules',
  'src': __dirname + '/../src'
});

// Imports esenciales
import { VercelRequest, VercelResponse } from '@vercel/node';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@modules/admin/all-exceptions.filter'; // Usando el alias
import { json, urlencoded } from 'body-parser';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = await NestFactory.create(AppModule);

    // Configuración de la aplicación
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
  } catch (error) {
    console.error('Error inicializando la aplicación:', error);
    res.status(500).send('Internal Server Error');
  }
}