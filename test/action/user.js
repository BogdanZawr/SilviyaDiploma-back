import { expect, assert } from 'chai';

import { user } from '../init';

describe('action', () => {
  describe('user', () => {
    let userAction;

    before(async () => {
      userAction = require('../../server/action/user').default;
    });

    describe('update', () => {
      it('valid', async () => {
        const res = await userAction.update({ firstName: 'testRead3' }, { _id: user._id });

        expect(res).to.have.all.keys([
          'createdAt',
          'updatedAt',
          'isDeleted',
          'roles',
          '_id',
          'email',
          'firstName',
          'lastName',
        ]);

        expect(res).to.have.property('isDeleted', user.isDeleted);
        expect(res).to.have.property('email', user.email);
        expect(res).to.have.property('firstName', 'testRead3');
        expect(res).to.have.property('lastName', user.lastName);
        expect(res.roles).to.deep.equal(user.roles);
      });
    });
  });
});
