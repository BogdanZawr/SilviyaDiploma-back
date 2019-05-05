import _ from 'lodash';

import db from '../../component/db';

const chapterWrite = db.model('write', 'chapter');

class ChapterWrite {
  create(data) {
    return chapterWrite.insertRow({
      data,
    });
  }

  update(_id, data) {
    return chapterWrite.updateRow({
      query: {
        _id,
      },
      data,
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
}

export default new ChapterWrite();
