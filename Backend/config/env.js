// טוען משתני סביבה ובודק אותם באמצעות Joi

const Joi = require('joi');

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development','production').default('production'),
  PORT: Joi.number().default(3000),
  MONGO_USERNAME: Joi.string().required(),
  MONGO_PASSWORD: Joi.string().required(),
  CLUSTER_URL: Joi.string().required(),
  SESSION_KEY: Joi.string().min(32).required(),
  REDIS_PASSWORD: Joi.string().min(32).required(),
  JWT_KEY: Joi.string().min(32).required(),       // מפתח JWT
  DAILY_API_KEY: Joi.string().required(),         // מפתח Daily API
}).unknown(); // מאפשר env-vars נוספים בלי לשבור את הבדיקה

const { error, value: validatedEnv } = schema.validate(process.env);
if (error) {
  console.error('Invalid environment variables:', error.message);
  process.exit(1);
}

Object.assign(process.env, validatedEnv);
module.exports = process.env;
