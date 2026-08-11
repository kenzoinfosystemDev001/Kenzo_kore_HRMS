import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  
  app.use(helmet());
  app.enableShutdownHooks();

  app.setGlobalPrefix('api', { exclude: ['/health'] });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  const allowedOrigins = [frontendUrl, 'http://localhost:3000', 'http://localhost:3001', 'https://kenzo-kore-hrms-web.vercel.app'];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('CORS origin security violation'));
      }
    },
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Kenzo HRMS API')
    .setDescription('The Kenzo HRMS API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);
  
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
