import { Injectable } from '@nestjs/common';

@Injectable()
export class CompanyService {
  test() {
    console.log('CompanyService');
  }
}
