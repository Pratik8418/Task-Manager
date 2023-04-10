const express = require('express');
const Task = require('../model/task');
const router = new express.Router();
const auth = require('../middleware/auth')

// const app = express();
// const PORT = process.env.PORT || 3000;
// app.use(express.json());

//Task CRUD
router.post('/task', auth , async (req, res) => {
  //const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    "owner" : req.user._id
  })

  try {
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
})

router.get('/tasks', auth ,async (req,res) => {
  try{
     //const tasks = await Task.find({}); -- without middleware
    //  const tasks = await Task.find({"owner" : req.user._id}) -- use middleware or below method is also allowed

    const match = {} // match object for filtering using url key and value
 
    if(req.query.status){
      match.status = req.query.status === 'true'
    }

    await req.user.populate('tasks').execPopulate({
      path : 'tasks',
      match
    })
     
    res.send(req.user.tasks); // for this populate method
  }catch(e){
    res.status(500).send(e);
  }
})

router.get('/task/:id', auth, async (req,res) => {
    _id = req.params.id;

    try{
      //const task = await Task.findById(_id);
      const task = await Task.findOne({ _id, "owner" : req.user._id})
      if(!task){
        return res.status(404).send("Error : Invalid id");
      }

      res.send(task);
    }catch(e){
      res.status(500).send(e);
    }
})

router.patch('/task/:id', auth , async (req,res) => {
   const updateKeys = Object.keys(req.body);
   const taskDocumentsKey = ["description","status"];
   const isValidKey = updateKeys.every( (key) => taskDocumentsKey.includes(key));

   if(!isValidKey){
    return res.status(400).send("Error : Invalid Key");
   }

  try{
   // const task = await Task.findByIdAndUpdate(req.params.id, req.body , {new:true , runValidators : true});
     const task = await Task.findOne({_id : req.params.id, owner : req.user._id})
     if(!task){
      return res.status(404).send();
     }

    updateKeys.forEach( (updateKey) => task[updateKey] = req.body[updateKey]);

    await task.save();
    res.send(task);
  }catch(e){
    res.status(400).send(e);
  }
})

router.delete('/task/:id', auth , async (req,res) => {
  try{
   //const task = await Task.findByIdAndDelete(req.params.id);
   const task = await Task.findOneAndDelete({_id : req.params.id, owner : req.user._id});
   if(!task){
    return res.status(400).send("Error Invalid Id");
   }
   
   res.send(task);
  }catch(e){
    res.status(400).send(e);
  }
})

module.exports = router