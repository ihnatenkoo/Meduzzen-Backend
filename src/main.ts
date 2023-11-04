import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { GeneralResponseInterceptor } from './interceptors/generalResponse.interceptor';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { operationsSorter, tagsSorter } from './utils/swagger/swaggerSorts';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  const docRoute = process.env.API_DOC_PREFIX ?? 'doc';

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalInterceptors(new GeneralResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Meduzzen api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docRoute, app, document, {
    swaggerOptions: {
      tagsSorter,
      operationsSorter,
    },
  });

  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port} 🚀`);
  Logger.log(
    `🚀 Swagger is running on: http://localhost:${port}/${docRoute} 🚀`,
  );
}
bootstrap();
