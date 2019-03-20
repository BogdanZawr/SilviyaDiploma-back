import _ from 'lodash';

import userWrite from '../model/write/user';

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

class UserAction {
  async update(data, _id) {
    const user = await userWrite.update(_id, data);

    return _.pick(user, userFreeData);
  }
}


export default new UserAction();
