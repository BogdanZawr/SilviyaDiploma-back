import accessAction from './action/access';
import userWrite from './model/write/user';

export default async () => {
  try {
    const user = await userWrite.findByEmail('first@mail.com');

    if (user) {
      return;
    }

    await accessAction.register({
      email: 'first@mail.com',
      password: 'first',
      firstName: 'first',
      lastName: 'first',
    });
  } catch (err) {
    console.log(err);
  }
};
