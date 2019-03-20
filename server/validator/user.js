import _ from 'lodash';

import userWrite from '../model/write/user';
import validator from '../component/validator';

const userFreeData = [
  'email',
  'firstName',
  'lastName',
];

class UserValidate {
  async update(body = {}, user) {
    const errorList = validator.validate(body, {
      email: {
        type: 'email',
        empty: false,
        optional: true,
      },
      firstName: {
        type: 'string',
        empty: false,
        optional: true,
      },
      lastName: {
        type: 'string',
        empty: false,
        optional: true,
      },
    });

    if (_.isArray(errorList)) {
      throw (errorList);
    }

    const userObj = await userWrite.findById(user._id);

    if (!userObj) {
      throw ([{ param: 'email', message: 'User not found' }]);
    }

    return _.pick(body, userFreeData);
  }
}

export default new UserValidate();
