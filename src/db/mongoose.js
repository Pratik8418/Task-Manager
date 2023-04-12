const mongoose = require('mongoose');
const error = require('mongoose/lib/error');
const { Number } = require('mongoose/lib/schema/index');


// mongoose.set('useFindAndModify', true);

const connectionUrl = 'mongodb://127.0.0.1:27017/task-manager-api';

mongoose.connect(connectionUrl, {
  useNewUrlParser:true,
  useCreateIndex : true,
  useUnifiedTopology: true 
})

