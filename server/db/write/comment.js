import mongoose, { Schema } from 'mongoose';
import _ from 'lodash';


import standardField from '../../component/db/dbStandardField';

export default new Schema(_.assignIn({
  fictionId: { type: mongoose.Types.ObjectId, required: true },

  content: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
},
standardField));
