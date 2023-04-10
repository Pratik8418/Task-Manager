const express = require('express');
require('./db/mongoose')
// const User = require('../src/model/user');
// const Task = require('../src/model/task');

const taskRoute = require('./Routes/taskRoute');
const userRoute = require('./Routes/userroute');

const app = express();
//app.use(userRoute);
//app.use(taskRoute);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(userRoute);
app.use(taskRoute);

app.listen(PORT, (res, error) => {
  if (error) {
    console.log("Error in server setup");
  }
  console.log("Server listing on PORT ", PORT);
})














// Async and await
// User.findByIdAndDelete('87439812jhfwiu983274').then(() => {
//      return User.countDocuments( {Description : false});
// }).catch( (e) => {
//      return console.log(e);
// })

// const deleteByIdAndDelete = async (id) => {
//      const deleteUser = await User.findByIdAndDelete(id);
//      const count = await User.countDocuments({Description : false});
//      return count
// }

// deleteByIdAndDelete("_id").then( (count) => {
//     console.log(count);
// }).catch( () => {

// })