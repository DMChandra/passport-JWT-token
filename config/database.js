const mongoose = require('mongoose')
const mongoDB = 'mongodb://127.0.0.1:27017/knovatorTask'

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB not connected\n',err));