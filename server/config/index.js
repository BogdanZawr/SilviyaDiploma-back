import nconf from 'nconf';
import _ from 'lodash';
import staticConfig from './static/config';

nconf.env().argv();

const environment = nconf.get('NODE_ENV') || 'development';

export default _.extend({
  environment,
},
staticConfig,
require(`${__dirname}/env/${environment}`), /* eslint "import/no-dynamic-require": 0 */
nconf.get());
