import keygen from 'keygen';

module.exports = {
  mongoDBTestCollectionPrefix: keygen.url(20),
  secretKey: {
    keepCount: 3,
    length: 256,
    lifetime: 259200000, // 1000 * 60 * 60 * 24 * 3
  },
  allowCrosOrigin: true,
  token: {
    accessExpired: 86400000, // 1000 * 60 *  60 * 24,
    refreshExpired: 172800000, // 1000 * 60 * 60 * 24 * 2
    refreshLength: 256,
    refreshRegenWithAccess: false,
    tokenPrefix: 'token',
    userPrefix: 'user',
    userFieldsList: ['_id', 'roles'],
  },
  accessCode: {
    lifetime: 900000, // 1000 * 60 * 15,
  },
  password: {
    passwordLength: 8,
    saltLength: 16,
  },
};
