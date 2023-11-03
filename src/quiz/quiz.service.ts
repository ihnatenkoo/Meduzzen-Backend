import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizEntity } from './quiz.entity';
import { CompanyEntity } from 'src/company/company.entity';
import { CreateQuizDto } from './dto/createQuiz.dto';
import { ACCESS_DENIED } from 'src/constants';

@Injectable()
export class QuizService {
  private readonly logger = new Logger(QuizService.name);

  constructor(
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async createQuiz(
    userId: number,
    companyId: number,
    createQuizDto: CreateQuizDto,
  ): Promise<{ quiz: QuizEntity }> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['owner', 'admins'],
    });

    if (
      company.owner.id !== userId &&
      !company.admins.some((admins) => admins.id === userId)
    ) {
      this.logger.error(
        `User id:${userId} tried to create quiz in company id:${companyId}`,
      );
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    const quiz = await this.quizRepository.save({ ...createQuizDto, company });

    delete quiz.company;

    return { quiz };
  }
}
