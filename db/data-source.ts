import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import 'dotenv/config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: [join(__dirname, '../', 'src', '**', '*.entity.js')],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
