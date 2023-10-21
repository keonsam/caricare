import dotenv from 'dotenv';

type NodeEnv = 'prod' | 'test' | 'dev';

dotenv.config();

const env: NodeEnv = (() => {
  switch (process.env.NODE_ENV) {
    case 'prod':
    case 'production':
      return 'prod';
    case 'test':
      return 'test';
    default:
      return 'dev';
  }
})();

type Config = {
  port: number;
  email: string;
  emailPassword: string;
  env: NodeEnv;
  db: {
    connectionString: string;
  };
  jwtSecret: string;
};

export default <Config>{
  port: Number(process.env.NODE_PORT ?? '3000'),
  email: process.env.EMAIL,
  emailPassword: process.env.EMAIL_PASSWORD,
  env,
  db: {
    connectionString: process.env.PG_CONNECTION_STRING,
  },
  jwtSecret: process.env.JWT_SECRET,
};
