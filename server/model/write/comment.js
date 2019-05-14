import _ from 'lodash';

import db from '../../component/db';

const commentWrite = db.model('write', 'comment');

class CommentWrite {
  create(data) {
    return commentWrite.insertRow({
      data,
    });
  }

  delete(_id) {
    return commentWrite.deleteRow({
      query: {
        _id,
      },
    });
  }

  findById(_id) {
    return commentWrite.findRow({
      query: {
        _id,
      },
    });
  }

  list(_id) {
    return commentWrite.findRows({
      query: {
        fictionId: _id,
      },
    });
  }
}

export default new CommentWrite();
