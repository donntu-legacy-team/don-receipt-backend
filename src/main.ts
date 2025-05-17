import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from '@/interfaces/logger/Interceptors/logger.interceptors';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from '@/infrastructure/modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggingInterceptor = app.get(LoggingInterceptor);

  app
    .useGlobalPipes(new ValidationPipe())
    .useGlobalInterceptors(loggingInterceptor)
    .enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3002'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('DonReceipt API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
