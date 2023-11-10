import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { dataSourceOptions } from 'db/data-source';
import { CorsMiddleware } from './middlewares/cors.middleware';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { InvitationModule } from './invitation/invitation.module';
import { JoinRequestModule } from './joinRequest/joinRequest.module';
import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';
import { QuizResultModule } from './quiz-result/quiz-result.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST ?? 'localhost',
      port: process.env.REDIS_PORT ?? 6379,
    }),
    MailerModule.forRoot({
      transport: process.env.NODEMAILER_TRANSPORT,
    }),
    JwtModule.register({}),
    UserModule,
    AuthModule,
    CompanyModule,
    InvitationModule,
    JoinRequestModule,
    QuizModule,
    QuestionModule,
    QuizResultModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware, AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
