import _ from 'lodash';

import fictionWrite from '../model/write/fiction';

class FictionAction {
  create(data) {
    return fictionWrite.create(data);
  }

  update(data) {
    return fictionWrite.update(data._id, _.omit(data, ['_id']));
  }

  delete(data) {
    return fictionWrite.delete(data._id);
  }

  getFilteredList(data) {
    return fictionWrite.list(data);
  }
}


export default new FictionAction();
