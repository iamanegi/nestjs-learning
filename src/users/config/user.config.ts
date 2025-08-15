import { registerAs } from '@nestjs/config';

export default registerAs('userConfig', () => ({
  apiKey: process.env.USER_API_KEY,
}));
