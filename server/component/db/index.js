import mongoose, { Schema } from 'mongoose';
import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import q from 'q';

import config from '../../config';
import extendMongoose from './model';

mongoose.Promise = global.Promise;

const mongoEventList = [
  'open',
  'connecting',
  'connected',
  'disconnecting',
  'disconnected',
  'reconnected',
  'fullsetup',
];

class DBList {
  constructor() {
    this.dbList = {};
    this.db = {};
    this.models = {};

    this.checkDBSchemaExists();
    this.checkDBConnectionStringExists();
  }

  async init() {
    await this.connectDBList();

    _.keys(this.db).forEach((dbType) => {
      extendMongoose(dbType);
    });
  }

  checkDBSchemaExists() {
    _.each(config.mongoConnectionStrings, (connectionString, dbName) => {
      const dir = path.join(__dirname, '../..', 'db', dbName);

      if (!fs.existsSync(dir)) {
        throw (new Error(`No database schema found for: '${dbName}'. Create directory`));
      }

      const stat = fs.statSync(dir);

      if (!stat || !stat.isDirectory(dir)) {
        throw (new Error(`No database schema found for: '${dbName}'. Create directory`));
      }

      const fileList = fs.readdirSync(dir);

      let error = false;

      fileList.forEach((fileName) => {
        const schemaList = require(path.join(__dirname, '../..', 'db', dbName, fileName)); /* eslint "import/no-dynamic-require": 0 */

        _.values(schemaList).forEach((schema) => {
          if (!(schema instanceof Schema)) {
            error = true;
          }
        });
      });

      if (error) {
        throw (new Error(`No database schema found for: '${dbName}'. Create schema file`));
      }

    });
  }

  checkDBConnectionStringExists() {
    const list = fs.readdirSync(path.join(__dirname, '../..', 'db'));

    list.forEach((dir) => {
      const stat = fs.statSync(path.join(__dirname, '../..', 'db', dir));

      if (stat && stat.isDirectory(dir) && !config.mongoConnectionStrings[dir]) {
        throw (new Error(`No connection strings found for: '${dir}'. Create connection strings`));
      }
    });
  }

  connectDB(connectionString, name) {
    const deferred = q.defer();

    this.db[name] = mongoose.createConnection(connectionString, {
      useNewUrlParser: true,
      useCreateIndex: true,
      poolSize: 10,
    }, () => {
      deferred.resolve();
    });

    return deferred.promise;
  }

  connectDBList() {
    const dbList = [];

    _.keys(config.mongoConnectionStrings).forEach((name) => {
      const db = this.connectDB(config.mongoConnectionStrings[name], name);
      dbList.push(db);

      mongoEventList.forEach((eventName) => {
        this.db[name].on(eventName, () => {
          if (config.environment === 'development') {
            console.log('Database event', eventName);
          }
        });
      });

      this.db[name].on('error', (err) => {
        throw err;
      });

      // database connection has been closed
      this.db[name].on('close', () => {
        this.connectDB(config.mongoConnectionStrings[name], name);
      });
    });

    return Promise.all(dbList);
  }

  createCollection(models) {
    _.keys(models).forEach((dbType) => {
      this.models[dbType] = this.models[dbType] || {};

      _.keys(models[dbType]).forEach((name) => {
        if (config.environment === 'test') {
          this.models[dbType][name] = this.db[dbType].model(`${config.mongoDBTestCollectionPrefix}_${name}`, models[dbType][name]);
          return;
        }

        this.models[dbType][name] = this.db[dbType].model(name, models[dbType][name]);
      });
    });
  }

  isObjectId(token) {
    return mongoose.Types.ObjectId.isValid(token);
  }

  toObjectId(id) {
    return this.dbList.isObjectId(id) ? mongoose.Types.ObjectId(id) : null;
  }

  async drop() {
    return Promise.all(_.values(this.db)
      .map(db => Promise.all(_.values(db.collections)
        .map(async (collection) => {
          try {
            await collection.drop();
          } catch (e) {
            console.log(e);
          }
        }))));
  }

  model(dbType, name) {
    return this.models[dbType][name] ? this.models[dbType][name][dbType]() : null;
  }
}

export default new DBList();
