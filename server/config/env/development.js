module.exports = {
  http: {
    port: process.env.PORT || 8000,
  },
  hostUrl: process.env.HOST_URL || 'http://localhost:8000/',
  mongoConnectionStrings: {
    write: 'mongodb://localhost:27017/base-write',
  },
  clientMainFile: '/apidoc/index.html',
  staticMaxAge: 0,
  mailgun: {
    mailFrom: 'base@gmail.com',
    api_key: 'key-11111111111111111111111111111111',
    domain: 'sandbox11111111111111111111111111111111.mailgun.org',
  },
  redis: {
    url: 'redis://127.0.0.1:6379',
  },
};
