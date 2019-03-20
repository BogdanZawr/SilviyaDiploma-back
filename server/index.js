import Koa from 'koa';
import fs from 'fs';
import send from 'koa-send';
import path from 'path';
import body from 'koa-body';
import passport from 'koa-passport';
import os from 'os';

import bootstrap from './component/bootstrap';
import config from './config';
import secretKey from './component/secretKey';

const main = async () => {
  try {
    await bootstrap.models();

    secretKey.init();
    secretKey.scheduleStart();

    await require('./start').default();

    const app = new Koa();

    app.use(passport.initialize());

    app.use(body({
      multipart: true,
      formidable: {
        uploadDir: os.tmpdir(),
      },
    }));

    bootstrap.routes(app);

    app.use(async (req, next) => {
      if (req.req
        && req.req._parsedUrl
        && req.req._parsedUrl.pathname
        && fs.existsSync(path.join(__dirname, '/../apidoc', req.req._parsedUrl.pathname))) {
        await send(req, path.join('/../apidoc', req.req._parsedUrl.pathname));
        return;
      }

      next();
    });

    app.listen(config.http.port, () => {
      console.log([new Date(), 'Server started on', config.http.port].join(' '));
    });
  } catch (err) {
    console.error(err);
  }
};

main();
