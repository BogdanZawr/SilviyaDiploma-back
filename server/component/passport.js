import passport from 'koa-passport';
import q from 'q';
import _ from 'lodash';

import { Strategy as BearerStrategy } from 'passport-http-bearer';

import secretKey from './secretKey';
import middlewareWrapper from './middlewareWrapper';

export const bearerMiddleware = async (req, next) => {
  const deferred = q.defer();

  passport.authenticate('bearer', (err, user) => {
    if (err) {
      deferred.reject(err);
      return;
    }

    if (!user) {
      deferred.reject([{ message: 'User not found', param: 'accessToken' }]);
      return;
    }

    deferred.resolve(user);
  })(req, null);

  try {
    req.request.user = await deferred.promise;
    await next();
  } catch (err) {
    req.body = err;
    req.status = 400;

    middlewareWrapper.headerSet(req);
  }
};

passport.use(new BearerStrategy(async (token, done) => {
  let tokenEnc;

  try {
    tokenEnc = await secretKey.decrypt(token);
  } catch (err) {
    done([{ message: err, param: 'accessToken' }]);
  }

  if (!tokenEnc || !tokenEnc._id || !tokenEnc.roles || !tokenEnc.expireTime) {
    done([{ message: 'Access token is incorrect', param: 'accessToken' }]);
    return;
  }

  if (new Date(tokenEnc.expireTime) < new Date()) {
    done([{ message: 'Access token is expired', param: 'accessToken' }]);
    return;
  }

  done(null, _.omit(tokenEnc, ['expireTime']));
}));

export { passport };
