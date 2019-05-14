import _ from 'lodash';
import mongoose from 'mongoose';

import fictionWrite from '../model/write/fiction';
import chapterWrite from '../model/write/chapter';
import validator from '../component/validator';

class FictionValidate {
  async create(body = {}, user) {
    const errorList = validator.validate(body, {
      name: {
        type: 'string',
        empty: false,
      },
      content: {
        type: 'string',
        empty: false,
      },
      chapterNumber: {
        type: 'number',
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

    const fiction = await fictionWrite.findById(body.fictionId);

    if (!fiction) {
      throw 'User not found';
    }

    if (!fiction.userId.equals(user._id)) {
      throw 'Access denied';
    }

    return _.pick(body, ['name', 'content', 'chapterNumber', 'fictionId']);
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

    const chapter = await chapterWrite.findById(body._id);

    const fiction = await fictionWrite.findById(chapter.fictionId);

    if (!fiction.userId.equals(user._id)) {
      if (!user.roles.includes('admin')) {
        throw 'Access denied';
      }
    }

    return _.pick(body, ['_id']);
  }

  async list(body = {}) {
    const errorList = validator.validate(body, {
      fictionId: {
        type: 'mongoId',
        empty: false,
      },
      limit: {
        type: 'number',
        optional: true,
      },
      pageNumber: {
        type: 'number',
        optional: true,
      },
    });

    if (_.isArray(errorList)) {
      throw (errorList);
    }

    return _.pick(body, ['fictionId', 'limit', 'pageNumber']);
  }
}

export default new FictionValidate();
