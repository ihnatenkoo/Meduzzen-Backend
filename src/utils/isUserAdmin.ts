import { HttpException, HttpStatus } from '@nestjs/common';
import { CompanyEntity } from 'src/company/company.entity';
import { UserEntity } from 'src/user/user.entity';

export const isUserAdmin = (
  userId: number,
  company: CompanyEntity,
): boolean => {
  if (!company || !company.owner || !company.admins) {
    throw new HttpException(
      'Company owner and array of admins are required',
      HttpStatus.BAD_REQUEST,
    );
  }

  if (
    company.owner.id === userId ||
    company.admins.some((admin: UserEntity) => admin.id === userId)
  ) {
    return true;
  }

  return false;
};
