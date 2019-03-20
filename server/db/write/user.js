import { Schema } from 'mongoose';
import _ from 'lodash';

import standardField from '../../component/db/dbStandardField';

export default new Schema(_.assignIn({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  lastName: { type: String, required: true },
  firstName: { type: String, required: true },

  salt: String,
  password: String,

  roles: [{ type: String, enum: ['admin', 'user', 'professional'], default: ['user'] }],
},
standardField));
