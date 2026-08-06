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

  app.setGlobalPrefix('api', { exclude: ['/'] });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL') || '*',
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

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/api/health', (req: any, res: any) => {
    res.send({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
