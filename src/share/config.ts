import * as dotenv from 'dotenv';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env'
      : `.env.${process.env.NODE_ENV}`,
});

const port = process.env.PORT || '3000';

export const config = {
  envName: process.env.NODE_ENV,
  port,
  // privateKeySecret: process.env.JWT_SECRET_KEY || 'hello',
  // db: {
  //   name: process.env.DB_NAME,
  //   username: process.env.DB_USERNAME,
  //   password: process.env.DB_PASSWORD,
  //   host: process.env.DB_HOST,
  //   port: process.env.DB_PORT,
  // },
  // upload: {
  //   type: 'local',
  //   path: 'uploads',
  //   cdn: process.env.CDN_URL || `http://localhost:${port}/uploads`,
  // },
  // dbURL: `postgres://postgres:muckhotieu@localhost:5432/utc-researchhub?schema=public&connection_limit=10&pool_timeout=30000`,
};
