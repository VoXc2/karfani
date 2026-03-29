import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: [
      process.env.WEB_URL || 'http://localhost:3000',
      process.env.ADMIN_URL || 'http://localhost:3001',
    ],
    credentials: true,
  });

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: { statusCode: 429, message: 'Too many requests, please try again later.' },
    }),
  );

  app.use(
    '/api/v1/auth',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      message: { statusCode: 429, message: 'Too many authentication attempts, please try again later.' },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Karfani API')
    .setDescription('Saudi Caravan Mobility & Outdoor Experience Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 4000;
  await app.listen(port);
  console.log(`Karfani API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
