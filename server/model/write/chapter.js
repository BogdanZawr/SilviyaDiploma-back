import _ from 'lodash';

import db from '../../component/db';

const chapterWrite = db.model('write', 'chapter');

class ChapterWrite {
  create(data) {
    return chapterWrite.insertRow({
      data,
    });
  }

  delete(_id) {
    return chapterWrite.deleteRow({
      query: {
        _id,
      },
    });
  }

  getListByFictionId(fictionIdList, pageNumber = 0, limit = 30) {
    return chapterWrite.findWithOptions({
      query: {
        fictionId: { $in: fictionIdList },
      },
      options: {
        limit,
        pageNumber,
      },
    });
  }

  findById(_id) {
    return chapterWrite.findRow({
      query: {
        _id,
        isDeleted: false,
      },
    });
  }

  list({ fictionId, limit = 50, pageNumber = 0 }) {
    return chapterWrite.findWithOptions({
      query: {
        fictionId,
      },
      options: {
        limit,
        pageNumber,
      },
    });
  }
}

export default new ChapterWrite();
