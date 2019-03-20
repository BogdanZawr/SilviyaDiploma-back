import FastestValidator from 'fastest-validator';

class Validator {
  constructor() {
    const validator = new FastestValidator({
      messages: {
        invalidField: "Invalid field '{field}'",
      },
    });

    // Register a custom 'mongoId' validator
    validator.add('mongoId', (_id) => {
      const mongoose = require('mongoose');
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return validator.makeError('invalidField', 'mongoose.Types.ObjectId', _id);
      }

      return true;
    });

    return validator;
  }
}

export default new Validator();
