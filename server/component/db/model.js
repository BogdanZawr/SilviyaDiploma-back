import mongoose from 'mongoose';
import _ from 'lodash';
import q from 'q';

const defaultLimit = 20; // page size
const defaultPageNumber = 0; // page number
const defaultAsc = 1; // sort asc
const defaultDesc = -1; // sort desc
const defaultPageCount = 0; // page count with empty result
const defaultTotalCount = 0; // total count with empty result

const extendMongoose = (dbType) => {
  mongoose.Model[dbType] = function () {
    const self = this;
    return {
      updateRow: ({ query = {}, data }) => {
        const deferred = q.defer();

        const Model = self;

        Model.findOne(query, (err, doc) => {
          if (err) {
            deferred.reject(err);
            return;
          }

          if (!doc) {
            const message = `Entity from model ${Model.modelName} was not found by query ${JSON.stringify(query)}`;
            const error = new Error(message);
            deferred.reject(error);
            return;
          }

          _.extend(doc, _.omit(data, '__v'));
          doc.save((err2, item) => {
            if (err2) {
              deferred.reject(err2);
              return;
            }

            deferred.resolve(item.toObject());
          });
        });

        return deferred.promise;
      },

      insertRow: ({ data }) => {
        const deferred = q.defer();

        const Model = self;

        const doc = new Model(data);
        doc.save((err, item) => {
          if (err) {
            deferred.reject(err);
            return;
          }

          deferred.resolve(item.toObject());
        });

        return deferred.promise;
      },

      deleteRow: ({ query = {} }) => {
        const deferred = q.defer();

        const Model = self;

        Model.findOne(query, (err, doc) => {
          if (err) {
            deferred.reject(err);
            return;
          }

          if (!doc) {
            const message = `Entity from model ${Model.modelName} was not found by query ${JSON.stringify(query)}`;
            const error = new Error(message);
            deferred.reject(error);
            return;
          }

          doc.remove((err2) => {
            if (err2) {
              deferred.reject(err2);
              return;
            }

            deferred.resolve(doc.toObject());
          });
        });

        return deferred.promise;
      },

      updateRows: ({ query = {}, data, options = {} }) => {
        const settings = _.extend(options, {
          multi: true,
        });

        return self.update(query, data, settings);
      },

      deleteRows: ({ query = {} }) => self.remove(query),

      insertRows: ({ data }) => self.insertMany(data),

      countRows: ({ query = {} }) => self.count(query),

      rowExists: ({ query = {} }) => {
        const deferred = q.defer();

        self.count(query, (err, count) => {
          if (err) {
            deferred.reject(err);
            return;
          }

          deferred.resolve(count > 0);
        });

        return deferred.promise;
      },

      aggregateRows: ({ query = [] }) => self.aggregate(query).allowDiskUse(true).exec(),

      populate: ({ items, options = {} }) => self.populate(items, options),

      findRows: ({ query = {} }) => self.find(query).lean().exec(),

      findRow: ({ query = {} }) => self.findOne(query).lean().exec(),

      findById: ({ id }) => {
        const deferred = q.defer();

        self.find({
          _id: mongoose.Types.ObjectId(id),
        }).lean().exec((err, user) => {
          if (err) {
            deferred.reject(err);
            return;
          }

          deferred.resolve(user[0] ? user[0] : null);
        });

        return deferred.promise;
      },

      findDocs: ({ query = {} }) => self.find(query).exec(),

      findDoc: ({ query = {} }) => self.findOne(query).exec(),

      findWithOptions: ({ query = {}, options = {} }) => {
        const deferred = q.defer();
        const settings = _.cloneDeep(options);

        let Query = self.find(query);

        settings.limit = (!Number(settings.limit)) ? defaultLimit : Number(settings.limit);
        settings.pageNumber = (!Number(settings.pageNumber)) ? defaultPageNumber : Number(settings.pageNumber);

        if (settings.select) {
          Query = Query.select(settings.select);
        }

        if (settings.sort) {
          const sort = typeof settings.sort === 'string' ? JSON.parse(settings.sort) : settings.sort;
          if (!_.isEmpty(sort)) {
            Query = Query.sort(sort);
          }
        }

        if (settings.pageNumber >= defaultPageNumber) {
          Query = Query.skip(settings.pageNumber * settings.limit).limit(settings.limit);
        }

        Query.lean().exec((err, results) => {
          if (err) {
            deferred.reject(err);
            return;
          }

          self.count(query, (err2, count) => {
            if (err2) {
              deferred.reject(err2);
              return;
            }

            const result = {
              pagesCount: Math.ceil(count / settings.limit),
              results,
              totalCount: count,
            };

            deferred.resolve(result);
          });
        });

        return deferred.promise;
      },

      aggregateWithOptions: ({ query = [], options = {} }) => {
        const deferred = q.defer();
        const settings = _.cloneDeep(options);

        settings.limit = (!Number(settings.limit)) ? defaultLimit : Number(settings.limit);
        settings.pageNumber = (!Number(settings.pageNumber)) ? defaultPageNumber : Number(settings.pageNumber);

        if (settings.sort) {
          const sort = typeof settings.sort === 'string' ? JSON.parse(settings.sort) : settings.sort;
          _.each(sort, (value, key) => {
            sort[key] = (value === 'asc') ? defaultAsc : defaultDesc;
          });

          if (!_.isEmpty(sort)) {
            query.push({ $sort: sort });
          }
        }

        const countQuery = _.cloneDeep(query);

        if (settings.pageNumber >= defaultPageNumber) {
          query.push({ $skip: settings.pageNumber * settings.limit });
        }

        if (settings.limit) {
          query.push({ $limit: settings.limit });
        }

        self.aggregate(query).allowDiskUse(true).exec((err, results) => {
          if (err) {
            deferred.reject(err);
            return;
          }

          if (!results) {
            const res = {
              pagesCount: defaultPageCount,
              results: [],
              totalCount: defaultTotalCount,
            };

            deferred.resolve(res);
          } else {
            const countquery = [].concat(countQuery, { $group: { _id: '1', count: { $sum: 1 } } }); // count request

            self.aggregate(countquery).allowDiskUse(true).exec((err2, count) => {
              if (err2) {
                deferred.reject(err2);
                return;
              }

              let res;

              if (count && count.length) {
                res = {
                  pagesCount: Math.ceil(count[0].count / options.limit),
                  results,
                  totalCount: count[0].count,
                };
              } else {
                res = {
                  pagesCount: 0,
                  results,
                  totalCount: 0,
                };
              }

              deferred.resolve(res);
            });
          }
        });

        return deferred.promise;
      },
    };
  };
};


export default extendMongoose;
