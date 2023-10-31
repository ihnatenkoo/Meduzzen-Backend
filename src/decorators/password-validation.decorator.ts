import { applyDecorators } from '@nestjs/common';
import { IsString, Matches, Length } from 'class-validator';

export const IsValidPassword = () => {
  return applyDecorators(
    IsString(),
    Matches(/^(?=.*[A-Z])(?=.*\d).+/, {
      message: 'Password must contain at least 1 uppercase letter and 1 digit',
    }),
    Length(8, 20, {
      message: 'Password must contain more than 7 and less than 21 symbols',
    }),
  );
};
