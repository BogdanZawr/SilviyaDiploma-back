import koaRouter from 'koa-router';

import action from '../action/like';
import validate from '../validator/like';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/like',
});

router.all([], bearerMiddleware);

router.post('/create', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const validData = await validate.create(req.request.body);
    return action.create(validData);
  });
});

router.post('/delete', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const validData = await validate.delete(req.request.body, req.request.user);
    return action.delete(validData, req.request.user);
  });
});

router.get('/list/:_id', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const validData = await validate.list(req.params);
    return action.list(validData);
  });
});
