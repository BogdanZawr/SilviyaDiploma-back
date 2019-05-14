import _ from 'lodash';
import mongoose from 'mongoose';

import fictionWrite from '../model/write/fiction';
import likeWrite from '../model/write/like';
import validator from '../component/validator';

class FictionValidate {
  async create(body = {}, user) {
    const errorList = validator.validate(body, {
      userId: {
        type: 'mongoId',
        empty: false,
      },
      fictionId: {
        type: 'mongoId',
        empty: false,
      },
    });

    if (_.isArray(errorList)) {
      throw (errorList);
    }

    return _.pick(body, ['userId', 'fictionId']);
  }

  async delete(body = {}, user) {
    const errorList = validator.validate(body, {
      _id: {
        type: 'mongoId',
        empty: false,
      },
    });

    if (_.isArray(errorList)) {
      throw (errorList);
    }

    const like = await likeWrite.findById(body._id);

    const fiction = await fictionWrite.findById(like.fictionId);

    if (!fiction.userId.equals(user._id)) {
      throw 'Access denied';
    }

    return _.pick(body, ['_id']);
  }

  async list(body = {}) {
    const errorList = validator.validate(body, {
      _id: {
        type: 'mongoId',
        empty: false,
      },
    });

    if (_.isArray(errorList)) {
      throw (errorList);
    }

    return _.pick(body, ['_id']);
  }
}

export default new FictionValidate();
