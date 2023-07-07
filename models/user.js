const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    // unique: true
  },
  password: {
    type: String,
    required: true
  }
});


UserSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});


UserSchema.methods.comparePassword = async function(candidatePassword, callback) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    callback(null, isMatch);
  } catch (error) {
    callback(error);
  }
};

module.exports = mongoose.model('User', UserSchema);
