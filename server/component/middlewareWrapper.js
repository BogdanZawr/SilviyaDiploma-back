import _ from 'lodash';

import config from '../config';

class MiddlewareWrapper {
  headerSet(req) {
    if (config.allowCrosOrigin) {
      /**
       * Response settings
       * @type {Object}
       */
      const responseSettings = {
        AccessControlAllowOrigin: req.header.origin,
        AccessControlAllowHeaders: 'Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name',
        AccessControlAllowMethods: 'POST, GET, PUT, DELETE, OPTIONS',
        AccessControlAllowCredentials: true,
        AccessControlExposeHeaders: 'Accept, Accept-Language, Content-Language, Content-Type, Content-Length',
      };

      /**
       * Headers
       */

      req.set('Access-Control-Allow-Credentials', responseSettings.AccessControlAllowCredentials);
      req.set('Access-Control-Allow-Origin', responseSettings.AccessControlAllowOrigin);
      req.set('Access-Control-Allow-Headers', (req.header['access-control-request-headers']) ? req.header['access-control-request-headers'] : responseSettings.AccessControlAllowHeaders);
      req.set('Access-Control-Allow-Methods', (req.header['access-control-request-method']) ? req.header['access-control-request-method'] : responseSettings.AccessControlAllowMethods);
      req.set('Access-Control-Expose-Headers', responseSettings.AccessControlExposeHeaders);
    }
  }

  singleError(error) {
    if (error instanceof Error) {
      console.log(error);
      return { message: error.stack };
    }

    if (_.isString(error)) {
      return { message: error };
    }

    if (_.isArray(error)) {
      return error;
    }

    if (_.isObject(error) && error.message) {
      return error;
    }

    console.log(error);
    return { message: 'Unknown server error oqued' };
  }

  errorBuilder(errors) {
    if (_.isArray(errors)) {
      const errorArray = [];

      errors.forEach((err) => {
        errorArray.push(this.singleError(err));
      });

      return errorArray;
    }

    return [this.singleError(errors)];
  }

  async wrape(req, next, middleware) {
    try {
      req.body = await middleware();

      this.headerSet(req);
    } catch (err) {
      req.body = this.errorBuilder(err);
      req.status = 400;
      this.headerSet(req);
      return;
    }

    next && (await next()); /* eslint "no-unused-expressions": 0 */
  }
}

export default new MiddlewareWrapper();
