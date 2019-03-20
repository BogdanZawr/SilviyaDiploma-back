import bootstrap from '../server/component/bootstrap';
import db from '../server/component/db';
import secretKey from '../server/component/secretKey';

export let user; /* eslint "import/no-mutable-exports": 0 */

before(async () => {
  await bootstrap.models();
  await secretKey.init();

  const accessAction = require('../server/action/access').default;
  user = await accessAction.register({
    email: 'test1@mail.com',
    password: 'testAdmin',
    firstName: 'testAdmin',
    lastName: 'testAdmin',
  });
});

after(async () => {
  await db.drop();
});
