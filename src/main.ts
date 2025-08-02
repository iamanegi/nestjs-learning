import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove any properties that are not in the DTO
      forbidNonWhitelisted: true, // throw an error if a property that is not in the DTO is sent
      transform: true, // transform the request body to the DTO type
    }),
  );
  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Blogs API')
    .setDescription('Blogs API description')
    .setVersion('1.0')
    .addServer('http://localhost:3000')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
