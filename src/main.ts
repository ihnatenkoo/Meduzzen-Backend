import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GeneralResponseInterceptor } from './interceptors/generalResponse.interceptor';
import { HttpExceptionFilter } from './filters/httpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalInterceptors(new GeneralResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT);
}
bootstrap();
