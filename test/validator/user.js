import { expect } from 'chai';

import { user } from '../init';

describe('validator', () => {
  describe('user', () => {
    let userValidate;

    before(async () => {
      userValidate = require('../../server/validator/user').default;
    });

    describe('update', () => {
      it('valid', async () => {
        const res = await userValidate.update({ email: 'test2@mail.com' }, { _id: user._id });

        expect(res).to.have.property('email', 'test2@mail.com');
      });

      it('fail email', async () => {
        let error;

        try {
          await userValidate.update({ email: 'testmailcom' }, { _id: user._id });
        } catch (err) {
          error = err;
        }

        expect(error[0]).to.have.all.keys(['field', 'message', 'type', 'actual', 'expected']);

        expect(error[0]).to.have.property('field', 'email');
        expect(error[0]).to.have.property('message', 'The \'email\' field must be a valid e-mail!');
        expect(error[0]).to.have.property('type', 'email');
      });

    });
  });
});
