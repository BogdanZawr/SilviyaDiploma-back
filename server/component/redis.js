import redis from 'redis';
import bluebird from 'bluebird';
import config from '../config';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export default redis.createClient({ url: config.redis.url });
