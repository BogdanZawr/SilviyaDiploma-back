import koaRouter from 'koa-router';

import action from '../action/chapter';
import validate from '../validator/chapter';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/chapter',
});

router.all(['/create', '/update', '/delete/*'], bearerMiddleware);

router.post('/create', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const validData = await validate.create(req.request.body, req.request.user);
    return action.create(validData, req.request.user);
  });
});

router.delete('/delete/:_id', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const validData = await validate.delete(req.params, req.request.user);
    return action.delete(validData, req.request.user);
  });
});

router.get('/list', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const validData = await validate.list(req.query);
    return action.getFilteredList(validData);
  });
});
