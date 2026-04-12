import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Security headers with CSP
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'https://cdn.moyasar.com'],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          connectSrc: ["'self'", process.env.WEB_URL || 'http://localhost:3000'],
        },
      },
    }),
  );

  app.use(compression());
  app.enableCors({
    origin: [
      process.env.WEB_URL || 'http://localhost:3000',
      process.env.ADMIN_URL || 'http://localhost:3001',
    ],
    credentials: true,
  });

  // Global rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      message: { statusCode: 429, message: 'طلبات كثيرة جداً، يرجى المحاولة لاحقاً' },
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // Stricter rate limiting for auth endpoints
  app.use(
    '/api/v1/auth',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: { statusCode: 429, message: 'محاولات تسجيل دخول كثيرة، يرجى المحاولة لاحقاً' },
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Karfani API')
    .setDescription('كرفاني - Saudi Caravan Mobility & Outdoor Experience Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'المصادقة')
    .addTag('Inventory', 'الكرفانات')
    .addTag('Booking', 'الحجوزات')
    .addTag('Payments', 'المدفوعات')
    .addTag('Notifications', 'الإشعارات')
    .addTag('Analytics', 'التحليلات')
    .addTag('Admin', 'الإدارة')
    .addTag('Health', 'صحة النظام')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 4000;
  await app.listen(port);
  logger.log(`Karfani API running on http://localhost:${port}`);
  logger.log(`Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
