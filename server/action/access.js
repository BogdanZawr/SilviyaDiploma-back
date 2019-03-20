import _ from 'lodash';
import keygen from 'keygen';
import q from 'q';
import uuidv4 from 'uuid/v4';

import userWrite from '../model/write/user';
import token from '../component/token';
import mailer from '../component/mailer';
import config from '../config';


const userFreeData = [
  'accessToken',
  'refreshToken',
  'createdAt',
  'updatedAt',
  'isDeleted',
  'roles',
  '_id',
  'email',
  'firstName',
  'lastName',
];

class AccessAction {
  async register(data) {
    const user = await userWrite.newUser(data);
    return this.login(user);
  }

  async login(user) {
    const uuid = uuidv4();

    const refreshToken = await token.genRefresh(user, uuid);
    const accessToken = await token.genAccess(user, uuid);

    return _.pick(_.assignIn(user, {
      refreshToken,
      accessToken,
    }), userFreeData);
  }

  async loginConfirm(user) {
    const userData = await userWrite.findById(user._id);

    return _.pick(userData, userFreeData);
  }

  async refreshToken(userToken) {
    const user = await userWrite.findById(userToken._id);

    return token.genNewAccess(user, userToken.uuid);
  }

  async changePassword(password, user) {
    await userWrite.changePassword(user._id, password);

    return {
      result: 'success',
    };
  }

  async forgot(user) {
    const pass = keygen.url(config.password.passwordLength);

    const userData = await userWrite.changePassword(user._id, pass);

    const deferred = q.defer();

    mailer.messages().send({
      from: config.mailgun.mailFrom,
      to: userData.email,
      subject: 'Pasword reset',
      html: `<h4>This letter was sent to your e-mail to verify the identity when changing the password.</h4>
        <p>New password: ${pass}</p>`,
    }, (err, body) => {
      if (err) {
        console.log(err);
        deferred.reject(err);
        return;
      }
      deferred.resolve(body);
    });

    await deferred.promise;

    return {
      result: 'success',
    };
  }
}

export default new AccessAction();
