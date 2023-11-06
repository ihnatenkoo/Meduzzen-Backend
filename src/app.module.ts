import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
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

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
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
