import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Swagger support in dev
    }),
  );

  // CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Prefix: /api/v1
  app.setGlobalPrefix('api/v1');

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('CAPPINNO Mobility Nexus API')
    .setDescription(
      'Erasmus Mobility Management as a Service (EMaaS) REST API (/api/v1). Multi-tenant, OIDC/OAuth2 & RBAC enabled.',
    )
    .setVersion('1.0.0 (Phase 1)')
    .addTag('Health & Diagnostics')
    .addTag('Organisations (Tenants)')
    .addTag('Members & Invitations')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'CAPPINNO Mobility Nexus API Docs',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`🚀 CAPPINNO Mobility Nexus API is running on: http://localhost:${port}/api/v1`);
  logger.log(`📚 Swagger Documentation is available at: http://localhost:${port}/api/docs`);
}

bootstrap();
