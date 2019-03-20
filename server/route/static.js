import send from 'koa-send';
import koaRouter from 'koa-router';

import config from '../config';

export const router = koaRouter();

router.get([
  '/',
], async (req, next) => {
  await send(req, config.clientMainFile);
  await next();
});

/**
  * @apiDefine accessTokenError
  * @apiError {Object} AccessTokenIncorrect { param : 'accessToken', message : 'Access token is incorrect'}
  * @apiError {Object} AccessTokenExpired { param : 'accessToken', message : 'Access token is expired'}
  * @apiError {Object} UserNotFound { param : 'accessToken', message : 'User not found'}
*/
