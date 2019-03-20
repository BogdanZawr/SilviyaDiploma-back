import koaRouter from 'koa-router';

import config from '../config';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter();

if (config.allowCrosOrigin) {
  router.all('*', async (req, next) => {
    middlewareWrapper.headerSet(req);

    if (req.method === 'OPTIONS') {
      req.status = 200;
      req.body = 'OK';
    }
    else {
      await next();
    }
  });
}
