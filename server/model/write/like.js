import _ from 'lodash';

import db from '../../component/db';

const likeWrite = db.model('write', 'like');

class LikeWrite {
  create(data) {
    return likeWrite.insertRow({
      data,
    });
  }

  delete({ fictionId, userId }) {
    return likeWrite.deleteRow({
      query: {
        fictionId,
        userId,
      },
    });
  }

  findBylikeAndUserId({ fictionId, userId }) {
    return likeWrite.findRow({
      query: {
        fictionId,
        userId,
      },
    });
  }

  list(fictionId) {
    return likeWrite.findRows({
      query: {
        fictionId,
      },
    });
  }
}

export default new LikeWrite();
