import _ from 'lodash';
import mongoose from 'mongoose';

import fictionWrite from '../model/write/fiction';
import commentWrite from '../model/write/comment';
import validator from '../component/validator';

class FictionValidate {
  async create(body = {}, user) {
    console.log(body);

    const errorList = validator.validate(body, {
      userId: {
        type: 'mongoId',
        empty: false,
      },
      fictionId: {
        type: 'mongoId',
        empty: false,
      },
      content: {
        type: 'string',
        empty: false,
      },
      lastName: {
        type: 'string',
        empty: false,
      },

      firstName: {
        type: 'string',
        empty: false,
      },
    });

    if (_.isArray(errorList)) {
      throw (errorList);
    }

    return _.pick(body, ['userId', 'fictionId', 'content', 'firstName', 'lastName']);
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

    const comment = await commentWrite.findById(body._id);

    if (!comment.userId.equals(user._id)) {
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
