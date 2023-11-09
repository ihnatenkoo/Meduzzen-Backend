import { HttpException, HttpStatus } from '@nestjs/common';

export const ratioToPercentage = (value: number | string): number => {
  const number = +value;

  const result = +(number * 100).toFixed(4);

  if (isNaN(number)) {
    throw new HttpException(
      'ratioToPercentage logic error',
      HttpStatus.BAD_REQUEST,
    );
  }

  return result;
};
