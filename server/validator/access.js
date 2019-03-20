import _ from 'lodash';

import userWrite from '../model/write/user';
import tokenModel from '../component/token';
import validator from '../component/validator';

const userFreeData = [
  'createdAt',
  'updatedAt',
  'isDeleted',
  'roles',
  '_id',
  'email',
  'firstName',
  'lastName',
];

class AccessValidate {
  async forgot(body = {}) {
    const errorList = validator.validate(body, {
      email: {
        type: 'email',
        empty: false,
      },
    });

    if (_.isArray(errorList)) {
      throw (errorList);
    }

    const user = await userWrite.findByEmail(body.email);

    if (!user) {
      throw [{ param: 'email', message: 'User not found' }];
    }

    return _.pick(user, userFreeData);
  }

  async register(body = {}) {
    const errorList = validator.validate(body, {
      email: {
        type: 'email',
        empty: false,
      },
      password: {
        type: 'string',
        empty: false,
        min: 5,
        max: 20,
      },
      firstName: {
        type: 'string',
        empty: false,
      },
      lastName: {
        type: 'string',
        empty: false,
      },
    });

    if (_.isArray(errorList)) {
      throw (errorList);
    }

    const user = await userWrite.findByEmail(body.email);

    if (user && user.email === body.email) {
      throw [{ param: 'email', message: 'There is an existing user connected to this email' }];
    }

    return _.pick(body, ['email', 'password', 'firstName', 'lastName']);
  }

  async login(body = {}) {
    const errorList = validator.validate(body, {
      email: {
        type: 'email',
        empty: false,
      },
      password: {
        type: 'string',
        empty: false,
        min: 5,
        max: 20,
      },
    });

    if (_.isArray(errorList)) {
      throw (errorList);
    }

    const user = await userWrite.findByEmail(body.email);

    if (!user) {
      throw [{ param: 'email', message: 'User not found' }];
    }

    if (userWrite.saltPassword(user.salt, body.password) !== user.password) {
      throw [{ param: 'password', message: 'User password is not correct' }];
    }

    return _.pick(user, userFreeData);
  }

  async refreshToken(body = {}) {
    const errorList = validator.validate(body, {
      refreshToken: {
        type: 'string',
        empty: false,
      },
    });

    if (_.isArray(errorList)) {
      throw (errorList);
    }

    const token = await tokenModel.getUserIdByToken(body.refreshToken);

    if (!token) {
      throw [{ param: 'refreshToken', message: 'User not found' }];
    }

    return token;
  }

  async changePassword(body = {}, user) {
    const errorList = validator.validate(body, {
      password: {
        type: 'string',
        empty: false,
        min: 5,
        max: 20,
      },
      oldPassword: {
        type: 'string',
        empty: false,
        min: 5,
        max: 20,
      },
    });

    if (_.isArray(errorList)) {
      throw (errorList);
    }

    const userData = await userWrite.findById(user._id);

    if (!userData) {
      throw [{ param: 'accessToken', message: 'User not found' }];
    }

    if (!userData.salt || !userData.password || userWrite.saltPassword(userData.salt, body.oldPassword) !== userData.password) {
      throw [{ param: 'oldPassword', message: 'User old password is not correct' }];
    }

    return body.password;
  }
}

export default new AccessValidate();
