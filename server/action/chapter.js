import _ from 'lodash';

import chapterWrite from '../model/write/chapter';
import fictionWrite from '../model/write/fiction';

class ChapterAction {
  async create(data) {
    const chapter = await chapterWrite.create(data);
    const fiction = await fictionWrite.findById(chapter.fictionId);

    await fictionWrite.update(chapter.fictionId, { size: fiction.size + 1 });
    return chapterWrite.getListByFictionId(data.fictionId);
  }

  update(data) {
    return chapterWrite.update(data._id, _.omit(data, ['_id']));
  }

  async delete(data) {
    const chapter = await chapterWrite.delete(data);

    const fiction = await fictionWrite.findById(chapter.fictionId);

    await fictionWrite.update(chapter.fictionId, { size: fiction.size - 1 });

    return chapterWrite.getListByFictionId(chapter.fictionId);
  }

  getFilteredList(data) {
    return chapterWrite.list(data);
  }
}


export default new ChapterAction();
