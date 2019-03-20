import { expect } from 'chai';

import { user } from '../init';

describe('validator', () => {
  let body;
  let accessValidate;

  beforeEach(() => {
    accessValidate = require('../../server/validator/access').default;

    body = {
      email: 'test@mail.com',
      oldPassword: 'testAdmin',
      password: 'testAdmin',
      confirm: 'testAdmin',
      firstName: 'testAdmin',
      lastName: 'testAdmin',
    };
  });

  describe('access', () => {
    describe('register', () => {
      it('wrong email', async () => {
        let error;

        body.email = 'testmail.com';

        try {
          await accessValidate.register(body);
        } catch (err) {
          error = err;
        }

        expect(error[0]).to.have.all.keys(['field', 'message', 'type', 'actual', 'expected']);

        expect(error[0]).to.have.property('type', 'email');
        expect(error[0]).to.have.property('field', 'email');
        expect(error[0]).to.have.property('message', 'The \'email\' field must be a valid e-mail!');
      });

      it('password too short', async () => {
        let error;

        body.password = '22';
        try {
          await accessValidate.register(body);
        } catch (err) {
          error = err;
        }

        expect(error[0]).to.have.all.keys(['field', 'message', 'type', 'actual', 'expected']);

        expect(error[0]).to.have.property('type', 'stringMin');
        expect(error[0]).to.have.property('expected', 5);
        expect(error[0]).to.have.property('actual', 2);
        expect(error[0]).to.have.property('field', 'password');
        expect(error[0]).to.have.property('message', 'The \'password\' field length must be greater than or equal to 5 characters long!');
      });

      it('password too long', async () => {
        let error;

        body.password = '12345678901234567890123';
        try {
          await accessValidate.register(body);
        } catch (err) {
          error = err;
        }

        expect(error[0]).to.have.all.keys(['field', 'message', 'type', 'actual', 'expected']);

        expect(error[0]).to.have.property('type', 'stringMax');
        expect(error[0]).to.have.property('expected', 20);
        expect(error[0]).to.have.property('actual', 23);
        expect(error[0]).to.have.property('field', 'password');
        expect(error[0]).to.have.property('message', 'The \'password\' field length must be less than or equal to 20 characters long!');
      });

      it('firstName empty', async () => {
        let error;

        body.firstName = undefined;
        try {
          await accessValidate.register(body);
        } catch (err) {
          error = err;
        }

        expect(error[0]).to.have.all.keys(['field', 'message', 'type', 'actual', 'expected']);

        expect(error[0]).to.have.property('type', 'required');
        expect(error[0]).to.have.property('field', 'firstName');
        expect(error[0]).to.have.property('message', 'The \'firstName\' field is required!');
      });

      it('lastName empty', async () => {
        let error;

        body.lastName = undefined;
        try {
          await accessValidate.register(body);
        } catch (err) {
          error = err;
        }

        expect(error[0]).to.have.all.keys(['field', 'message', 'type', 'actual', 'expected']);

        expect(error[0]).to.have.property('type', 'required');
        expect(error[0]).to.have.property('field', 'lastName');
        expect(error[0]).to.have.property('message', 'The \'lastName\' field is required!');
      });

      it('email exists', async () => {
        let error;

        body.email = user.email;

        try {
          await accessValidate.register(body);
        } catch (err) {
          error = err;
        }

        expect(error).to.deep.equal([{ param: 'email', message: 'There is an existing user connected to this email' }]);
      });

      it('valid data', async () => {
        expect(await accessValidate.register(body)).to.deep.equal({
          email: body.email,
          password: body.password,
          firstName: body.firstName,
          lastName: body.lastName,
        });
      });
    });

    describe('login', () => {
      it('required email', async () => {
        let error;

        body.email = 'testmail.com';

        try {
          await accessValidate.login(body);
        } catch (err) {
          error = err;
        }

        expect(error[0]).to.have.all.keys(['field', 'message', 'type', 'actual', 'expected']);

        expect(error[0]).to.have.property('type', 'email');
        expect(error[0]).to.have.property('field', 'email');
        expect(error[0]).to.have.property('message', 'The \'email\' field must be a valid e-mail!');
      });

      it('required password', async () => {
        let error;

        body.password = '';

        try {
          await accessValidate.login(body);
        } catch (err) {
          error = err;
        }

        expect(error[0]).to.have.all.keys(['field', 'message', 'type', 'actual', 'expected']);

        expect(error[0]).to.have.property('type', 'stringEmpty');
        expect(error[0]).to.have.property('field', 'password');
        expect(error[0]).to.have.property('message', 'The \'password\' field must not be empty!');
      });

      it('user not found', async () => {
        let error;

        body.email = 'p4567567456@mail.com';

        try {
          await accessValidate.login(body);
        } catch (err) {
          error = err;
        }

        expect(error).to.deep.equal([{ param: 'email', message: 'User not found' }]);
      });

      it('wrong password', async () => {
        let error;

        body.password = '1111111111111111111';
        body.email = 'test1@mail.com';

        try {
          await accessValidate.login(body);
        } catch (err) {
          error = err;
        }

        expect(error).to.deep.equal([{ param: 'password', message: 'User password is not correct' }]);
      });

      it('valid data', async () => {
        body.email = 'test1@mail.com';

        const res = await accessValidate.login(body);

        expect(res).to.have.all.keys(['createdAt', 'updatedAt', 'isDeleted', 'roles', '_id', 'email', 'firstName', 'lastName']);

        expect(res).to.have.property('isDeleted', false);
        expect(res).to.have.property('email', 'test1@mail.com');
        expect(res).to.have.property('firstName', 'testAdmin');
        expect(res).to.have.property('lastName', 'testAdmin');
      });

    });

    describe('refreshToken', () => {
      it('required refresh token', async () => {
        let error;

        try {
          await accessValidate.refreshToken({});
        } catch (err) {
          error = err;
        }

        expect(error[0]).to.have.all.keys(['field', 'message', 'type', 'actual', 'expected']);

        expect(error[0]).to.have.property('type', 'required');
        expect(error[0]).to.have.property('field', 'refreshToken');
        expect(error[0]).to.have.property('message', 'The \'refreshToken\' field is required!');
      });

      it('refresh token not found', async () => {
        let error;

        try {
          await accessValidate.refreshToken({ refreshToken: '111' });
        } catch (err) {
          error = err;
        }

        expect(error).to.deep.equal([{ param: 'refreshToken', message: 'User not found' }]);
      });

      it('valid data', async () => {
        const res = await accessValidate.refreshToken({ refreshToken: user.refreshToken });

        expect(res).to.have.all.keys(['_id', 'uuid']);
        expect(res).to.have.property('_id', user._id.toString());
      });

    });

    describe('forgot', () => {
      it('required email', async () => {
        let error;

        body.email = 'testmail.com';

        try {
          await accessValidate.forgot(body);
        } catch (err) {
          error = err;
        }

        expect(error[0]).to.have.all.keys(['field', 'message', 'type', 'actual', 'expected']);

        expect(error[0]).to.have.property('type', 'email');
        expect(error[0]).to.have.property('field', 'email');
        expect(error[0]).to.have.property('message', 'The \'email\' field must be a valid e-mail!');
      });

      it('user not found', async () => {
        let error;

        body.email = 'p4567567456@mail.com';

        try {
          await accessValidate.forgot(body);
        } catch (err) {
          error = err;
        }

        expect(error).to.deep.equal([{ param: 'email', message: 'User not found' }]);
      });

      it('valid data', async () => {
        body.email = user.email;

        const res = await accessValidate.forgot(body);

        expect(res).to.have.all.keys(['createdAt', 'updatedAt', 'isDeleted', 'roles', '_id', 'email', 'firstName', 'lastName']);

        expect(res).to.have.property('isDeleted', false);
        expect(res).to.have.property('email', 'test1@mail.com');
        expect(res).to.have.property('firstName', 'testAdmin');
        expect(res).to.have.property('lastName', 'testAdmin');
      });

    });

    describe('changePassword', () => {
      it('password too short', async () => {
        let error;

        body.password = '22';
        try {
          await accessValidate.changePassword(body, user);
        } catch (err) {
          error = err;
        }

        expect(error[0]).to.have.all.keys(['field', 'message', 'type', 'actual', 'expected']);

        expect(error[0]).to.have.property('type', 'stringMin');
        expect(error[0]).to.have.property('expected', 5);
        expect(error[0]).to.have.property('actual', 2);
        expect(error[0]).to.have.property('field', 'password');
        expect(error[0]).to.have.property('message', 'The \'password\' field length must be greater than or equal to 5 characters long!');
      });

      it('password too long', async () => {
        let error;

        body.password = '12345678901234567890123';
        try {
          await accessValidate.changePassword(body, user);
        } catch (err) {
          error = err;
        }

        expect(error[0]).to.have.all.keys(['field', 'message', 'type', 'actual', 'expected']);

        expect(error[0]).to.have.property('type', 'stringMax');
        expect(error[0]).to.have.property('expected', 20);
        expect(error[0]).to.have.property('actual', 23);
        expect(error[0]).to.have.property('field', 'password');
        expect(error[0]).to.have.property('message', 'The \'password\' field length must be less than or equal to 20 characters long!');
      });

      it('user not found', async () => {
        let error;

        body.email = 'p4567567456@mail.com';

        try {
          await accessValidate.changePassword(body, { _id: '000000000000000000000000' });
        } catch (err) {
          error = err;
        }

        expect(error).to.deep.equal([{ param: 'accessToken', message: 'User not found' }]);
      });

      it('valid data', async () => {
        const res = await accessValidate.changePassword(body, user);
        expect(res).to.equal(body.password);
      });
    });
  });
});
