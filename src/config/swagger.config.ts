import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('UTC Research Hub API')
  .setDescription('API documentation for UTC Research Hub')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('auth', 'Authentication endpoints')
  .addTag('users', 'User management endpoints')
  .addTag('projects', 'Project management endpoints')
  .addTag('departments', 'Department management endpoints')
  .build();
