import _ from 'lodash';

import likeWrite from '../model/write/like';
import fictionWrite from '../model/write/fiction';

class LikeAction {
  async create(data) {
    const likeObj = await likeWrite.findBylikeAndUserId(data);
    let like;
    if (likeObj) {
      await likeWrite.delete(data);
      const fiction = await fictionWrite.findById(data.fictionId);
      like = fiction.like - 1;
      await fictionWrite.update(fiction._id, { like });

    } else {
      await likeWrite.create(data);
      const fiction = await fictionWrite.findById(data.fictionId);
      like = fiction.like + 1;
      await fictionWrite.update(fiction._id, { like });
    }
    return likeWrite.list(data.fictionId);
  }

  update(data) {
    return likeWrite.update(data._id, _.omit(data, ['_id']));
  }

  delete(data) {
    return likeWrite.delete(data._id);
  }

  list(data) {
    return likeWrite.list(data._id);
  }
}


export default new LikeAction();
