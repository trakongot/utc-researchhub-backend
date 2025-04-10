import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { config, swaggerConfig } from './common/config';
import { HttpExceptionFilter } from './exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kích hoạt global filter để xử lý ngoại lệ
  app.useGlobalFilters(new HttpExceptionFilter());

  // Tăng giới hạn kích thước file upload (50MB)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Thiết lập Swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Kích hoạt CORS
  app.enableCors();

  // Xử lý lỗi chưa được bắt để ngăn server crash
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  // Khởi động ứng dụng
  await app.listen(config.port);
  console.log(`
  ------------------------------------------------------------
  🎉🎉🎉 Application is running successfully! 🎉🎉🎉
  🚀 You can access it at: http://localhost:${config.port}/api 🚀
  ------------------------------------------------------------
  `);
}

// Gọi bootstrap và xử lý lỗi nếu có
bootstrap().catch((err) => console.error('Bootstrap failed:', err));
