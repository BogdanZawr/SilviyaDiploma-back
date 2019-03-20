import keygen from 'keygen';
import pbkdf2 from 'pbkdf2';
import _ from 'lodash';

import db from '../../component/db';
import config from '../../config/index';

const userWrite = db.model('write', 'user');

class UserWrite {
  hashPassword(password) {
    const salt = keygen.url(config.password.saltLength);
    return {
      salt,
      password: this.saltPassword(salt, password),
    };
  }

  saltPassword(salt, password) {
    return pbkdf2.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
  }

  update(_id, userData) {
    const data = _.pick(userData, ['email', 'firstName', 'lastName']);

    data.updatedAt = new Date();

    return userWrite.updateRow({
      query: { _id },
      data,
    });
  }

  newUser(userData) {
    const data = _.pick(userData, ['email', 'firstName', 'lastName']);

    data.roles = userData.roles || ['user'];

    return userWrite.insertRow({
      data: _.assignIn(data, this.hashPassword(userData.password)),
    });
  }

  changePassword(_id, password) {
    const data = this.hashPassword(password);
    data.updatedAt = new Date();

    return userWrite.updateRow({
      query: {
        _id,
        isDeleted: false,
      },
      data,
    });
  }

  findByEmail(email) {
    return userWrite.findRow({
      query: {
        email,
        isDeleted: false,
      },
    });
  }

  findById(_id) {
    return userWrite.findRow({
      query: {
        _id,
        isDeleted: false,
      },
    });
  }
}

export default new UserWrite();
