import koaRouter from 'koa-router';

import action from '../action/comment';
import validate from '../validator/comment';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/comment',
});

router.all(['/create', '/delete/*'], bearerMiddleware);

router.post('/create', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const validData = await validate.create(req.request.body);
    return action.create(validData);
  });
});

router.delete('/delete/:_id', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const validData = await validate.delete(req.params, req.request.user);
    return action.delete(validData, req.request.user);
  });
});

router.get('/list/:_id', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const validData = await validate.list(req.params);
    return action.list(validData);
  });
});
