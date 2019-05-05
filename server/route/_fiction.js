import koaRouter from 'koa-router';

import action from '../action/fiction';
import validate from '../validator/fiction';
import { bearerMiddleware } from '../component/passport';
import middlewareWrapper from '../component/middlewareWrapper';

export const router = koaRouter({
  prefix: '/api/v1/fiction',
});

router.all('/*', bearerMiddleware);

router.post('/create', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const validData = await validate.create(req.request.body, req.request.user);
    return action.create(validData, req.request.user);
  });
});

router.put('/update', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const validData = await validate.update(req.request.body, req.request.user);
    return action.update(validData, req.request.user);
  });
});

router.delete('/delete', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const validData = await validate.delete(req.request.body, req.request.user);
    return action.delete(validData, req.request.user);
  });
});

router.get('/getFilteredList', async (req) => {
  await middlewareWrapper.wrape(req, null, async () => {
    const validData = await validate.list(req.request.body, req.request.user);
    return action.getFilteredList(validData, req.request.user);
  });
});
