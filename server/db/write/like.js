import mongoose, { Schema } from 'mongoose';
import _ from 'lodash';


import standardField from '../../component/db/dbStandardField';

export default new Schema(_.assignIn({
  fictionId: { type: mongoose.Types.ObjectId, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true },
},
standardField));
