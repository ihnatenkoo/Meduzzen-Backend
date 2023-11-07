import { join } from 'path';
import { promises } from 'fs';
import * as json2csv from 'json2csv';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FileType } from 'src/quiz-result/interfaces';

interface ICreateFile {
  filePath: string;
  fileName: string;
}

export const createFile = async (
  data: unknown,
  type: FileType,
): Promise<ICreateFile> => {
  try {
    const fileName = new Date().getTime().toString();
    const directoryPath = join(process.cwd(), 'files');
    const filePath = join(directoryPath, fileName);

    const file = type === 'json' ? JSON.stringify(data) : json2csv.parse(data);

    await promises.mkdir(directoryPath, { recursive: true });
    await promises.writeFile(filePath, file);

    return { filePath, fileName };
  } catch (error) {
    throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
  }
};
