import _ from 'lodash';

import commentWrite from '../model/write/comment';

class CommentAction {
  async create(data) {
    const comment = await commentWrite.create(data);
    return commentWrite.list(comment.fictionId);
  }

  update(data) {
    return commentWrite.update(data._id, _.omit(data, ['_id']));
  }

  async delete(data) {
    const element = await commentWrite.delete(data._id);
    const list = await commentWrite.list(element.fictionId);
    return list;
  }

  list(data) {
    return commentWrite.list(data._id);
  }
}

export default new CommentAction();
