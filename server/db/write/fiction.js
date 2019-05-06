import mongoose, { Schema } from 'mongoose';
import _ from 'lodash';


import standardField from '../../component/db/dbStandardField';

export default new Schema(_.assignIn({
  name: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true },
  size: { type: Number, default: 0 },
  like: { type: Number, default: 0 },
  description: { type: String },
  status: { type: String, enum: ['stopped', 'inProgress', 'completed'], default: 'inProgress' },
  genre: [{
    type: String,
    enum: [
      'Антиутопия',
      'Детектив',
      'Драма',
      'Исторические',
      'Мистика',
      'Психология',
      'Романтика',
      'Стихи',
      'Ужасы',
      'Фантастика',
      'Фентези',
      'Экшн',
      'Приключения',
      'Комедия',
      'Статья',
      'Другое',
    ],
    required: true,
  }],
},
standardField));
