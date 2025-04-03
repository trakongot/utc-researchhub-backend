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
  privateKeySecret:
    process.env.JWT_SECRET_KEY ||
    '6f763f8afb21d463a3ef831b6f83780409ec5e182982811dd19a73f92e8d734ffde7a5949a90d9d5c72ab9c8e2349ee8c704d28795672525059c0a1d363a2e30e934f469a051688b7bddd34f836b39b776bff9c9b977281fcb3158450f269d0e5128279db96fa3627026c1c13c39e7986d40de4bf35e049d5f26a0a80b90faab259ba56906ca50be37c2996daac250339119c5e7e6f3ad67daa57becbd03aeb5563906fc7cdc430ccdef2e7fe8c48b16e7b68fb336e556311c24d272e9ed701b828e6a2a0fe1786bfad8b0086f68d2bdfe45e0c890de3c1a4a09f5e52a105911c0a2904986b1f18ed61bc32a6b3623256d67b05b575473e98498d825e8168193',
  refreshKeySecret:
    process.env.JWT_REFRESH_SECRET_KEY ||
    '6f763f8afb21d463a3ef831b6f83780409ec5e182982811dd19a73f92e8d734ffde7a5949a90d9d5c72ab9c8e2349ee8c704d28795672525059c0a1d363a2e30e934f469a051688b7bddd34f836b39b776bff9c9b977281fcb3158450f269d0e5128279db96fa3627026c1c13c39e7986d40de4bf35e049d5f26a0a80b90faab259ba56906ca50be37c2996daac250339119c5e7e6f3ad67daa57becbd03aeb5563906fc7cdc430ccdef2e7fe8c48b16e7b68fb336e556311c24d272e9ed701b828e6a2a0fe1786bfad8b0086f68d2bdfe45e0c890de3c1a4a09f5e52a105911c0a2904986b1f18ed61bc32a6b3623256d67b05b575473e98498d825e8168193',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
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
