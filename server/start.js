import accessAction from './action/access';
import userWrite from './model/write/user';

export default async () => {
  try {
    const user = await userWrite.findByEmail('first@mail.com');

    if (user) {
      return;
    }

    await accessAction.register({
      email: 'admin@mail.com',
      password: '123456',
      firstName: 'admin',
      lastName: 'root',
      roles: ['admin'],
    });
  } catch (err) {
    console.log(err);
  }
};
