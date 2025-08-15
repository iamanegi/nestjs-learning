import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'staging', 'production')
    .default('development'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().allow(''),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SYNC: Joi.boolean().required(),
  DATABASE_AUTOLOAD: Joi.boolean().required(),
  USER_API_KEY: Joi.string().required(),
});
