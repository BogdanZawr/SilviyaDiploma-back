import keygen from 'keygen';
import _ from 'lodash';
import aes256 from 'aes256';
import fs from 'fs';
import path from 'path';

import config from '../config';

const lastKey = 0; // number of latest key

class SecretKey {
  get file() {
    return path.join(__dirname, '/../../key.json');
  }

  async confirmList() {
    this.secretKeyList = _.slice(this.secretKeyList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()), 0, config.secretKey.keepCount);

    fs.writeFileSync(this.file, JSON.stringify(this.secretKeyList));
  }

  async init() {
    if (fs.existsSync(this.file)) {
      try {
        this.secretKeyList = JSON.parse(fs.readFileSync(this.file));

        if (!this.secretKeyList.length) {
          await this.generateNew();
        } else {

          for (const i in this.secretKeyList) {
            this.secretKeyList[i].createdAt = new Date(this.secretKeyList[i].createdAt);
          }

          this.confirmList();
        }

        return;
      } catch (e) {
        await this.generateNew();

        return;
      }
    }

    await this.generateNew();
  }

  async generateNew() {
    if (!this.secretKeyList || !_.isArray(this.secretKeyList)) {
      this.secretKeyList = [{
        key: keygen.url(config.secretKey.length),
        createdAt: new Date(),
      }];
    } else {
      this.secretKeyList.unshift({
        key: keygen.url(config.secretKey.length),
        createdAt: new Date(),
      });
    }

    this.confirmList();
  }

  async scheduleStart() {
    const that = this;
    setInterval(async () => {
      await that.generateNew();
    }, config.secretKey.lifetime);
  }

  async encrypt(data) {
    if (typeof data === 'object') {
      return aes256.encrypt(this.secretKeyList[lastKey].key, JSON.stringify(data));
    }

    throw 'Unable to encrypt token';
  }

  async decrypt(encrypted) {
    for (const i in this.secretKeyList) { /* eslint "no-restricted-syntax": 0 */
      try {
        const decrypted = aes256.decrypt(this.secretKeyList[i].key, encrypted);
        return JSON.parse(decrypted);
      } catch (err) { } /* eslint "no-empty": 0 */
    }

    throw 'Unable to decrypt token';
  }
}

export default new SecretKey();
