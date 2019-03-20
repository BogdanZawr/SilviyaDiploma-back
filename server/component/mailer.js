import Mailgun from 'mailgun-js';

import config from '../config';

let mailgun; /* eslint "import/no-mutable-exports": 0 */

class MailgunBung {
  messages() {
    return this;
  }

  send(obj, callback) {
    callback && callback(null, obj); /* eslint "no-unused-expressions": 0 */
    return this;
  }
}

if (config.environment === 'test') {
  mailgun = new MailgunBung();
} else {
  mailgun = new Mailgun({
    apiKey: config.mailgun.api_key,
    domain: config.mailgun.domain,
  });
}

export default mailgun;
