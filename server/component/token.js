import _ from 'lodash';
import keygen from 'keygen';

import secretKey from './secretKey';
import redis from './redis';
import config from '../config';

class Token {
  async generateUniqToken() {
    let notUniq = false;
    let refreshToken = null;

    do {
      refreshToken = keygen.url(config.token.refreshLength);
      const keyList = await redis.keysAsync(`${config.token.tokenPrefix}:${refreshToken}`); /* eslint "no-await-in-loop": 0 */
      notUniq = !!keyList.length;
    } while (notUniq);

    return refreshToken;
  }

  async genRefresh(user, uuid) {
    const refreshToken = await this.generateUniqToken();
    let expire = [];

    if (config.token.refreshExpired > 0) {
      expire = ['EX', Math.round(config.token.refreshExpired / 1000)];
    }

    try {
      const tokenStore = [`${config.token.tokenPrefix}:${refreshToken}`, JSON.stringify({
        _id: (user._id).toString(),
        uuid,
      }), ...expire];
      await redis.setAsync(...tokenStore);

      const userStore = [`${config.token.userPrefix}_${user._id}:${uuid}`, refreshToken, ...expire];
      await redis.setAsync(userStore);

      return refreshToken;
    } catch (err) {
      throw (err);
    }
  }

  getUserKeys(user) {
    return redis.keysAsync(`${config.token.userPrefix}_${user._id}:*`);
  }

  getUserTokens(userKeyList) {
    return Promise.all(userKeyList.map(key => (redis.getAsync(key))));
  }

  async getUserIdByToken(token) {
    return JSON.parse(await redis.getAsync(`${config.token.tokenPrefix}:${token}`));
  }

  async deleteUser(user) {
    const userKeyList = await this.getUserKeys(user);
    const userTokenList = await this.getUserTokens(userKeyList);

    userKeyList.forEach(key => (redis.del(key)));
    userTokenList.forEach(token => (redis.del(`${config.token.tokenPrefix}:${token}`)));
  }

  async deleteUserSession({ user, body }) {
    await redis.del(`${config.token.tokenPrefix}:${body.refreshToken}`);
    await redis.del(`${config.token.userPrefix}_${user._id}:${user.uuid}`);
  }

  async deleteToken(token) {
    const userId = await this.getUserIdByToken(token);
    if (!userId) {
      return;
    }
    const userKeyList = await this.getUserKeys({ _id: userId });
    const userTokenList = await this.getUserTokens(userKeyList);

    const index = _.indexOf(userTokenList, token);

    if (~index) {
      redis.del(userKeyList[index]);
    }
    redis.del(`${config.token.tokenPrefix}:${token}`);
  }

  async genAccess(user, uuid) {
    const tokenData = _.assignIn({ uuid }, _.pick(user, config.token.userFieldsList));

    tokenData.expireTime = new Date().getTime() + config.token.accessExpired;

    try {
      return await secretKey.encrypt(tokenData);
    } catch (err) {
      throw (err);
    }
  }

  async decryptAccess(tokenData) {
    try {
      return await secretKey.decrypt(tokenData);
    } catch (err) {
      throw (err);
    }
  }

  async genNewAccess(user, uuid) {
    const res = {};
    try {
      if (config.token.refreshRegenWithAccess) {
        res.refreshToken = await this.genRefresh(user, uuid);
      }

      res.accessToken = await this.genAccess(user, uuid);

      return res;
    } catch (err) {
      throw (err);
    }
  }
}

export default new Token();
