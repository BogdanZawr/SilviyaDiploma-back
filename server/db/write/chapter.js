import mongoose, { Schema } from 'mongoose';
import _ from 'lodash';


import standardField from '../../component/db/dbStandardField';

export default new Schema(_.assignIn({
  name: { type: String, required: true },
  content: { type: String, required: true },

  chapterNumber: { type: Number, required: true },

  fictionId: { type: mongoose.Types.ObjectId, required: true },
},
standardField));
