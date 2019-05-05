import _ from 'lodash';

import db from '../../component/db';

const commentWrite = db.model('write', 'comment');

class CommentWrite {
  create(data) {
    return commentWrite.insertRow({
      data,
    });
  }

  update(_id, data) {
    return commentWrite.updateRow({
      query: {
        _id,
      },
      data,
    });
  }

  getListByFictionId(fictionIdList, pageNumber = 0, limit = 30) {
    return commentWrite.findWithOptions({
      query: {
        fictionId: { $in: fictionIdList },
      },
      options: {
        limit,
        pageNumber,
      },
    });
  }
}

export default new CommentWrite();
