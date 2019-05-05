import _ from 'lodash';

import db from '../../component/db';

const fictionWrite = db.model('write', 'fiction');

class FictionWrite {
  create(data) {
    return fictionWrite.insertRow({
      data,
    });
  }

  update(_id, data) {
    return fictionWrite.updateRow({
      query: {
        _id,
      },
      data,
    });
  }

  delete(_id) {
    return fictionWrite.findRow({
      query: {
        _id,
        isDeleted: false,
      },
    });
  }

  list(data) {
    const searchFields = [
      'name',
      'like',
      'size',
    ];

    const query = {
      status: { $in: data.status },
      genre: { $in: data.genre },
      isDeleted: false,
    };

    if (data.search) {
      const or = [];

      searchFields.forEach((field) => {
        or.push({
          [field]: {
            $regex: data.search, $options: 'gi',
          },
        });
      });

      if (or && or.length) {
        query.$or = or;
      }
    }

    return fictionWrite.findWithOptions({
      query,
      options: _.pick(data, ['sort', 'limit', 'pageNumber']),
    });
  }

  findById(_id) {
    return fictionWrite.findRow({
      query: {
        _id,
        isDeleted: false,
      },
    });
  }
}

export default new FictionWrite();
