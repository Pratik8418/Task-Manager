const express = require('express');
const Task = require('../model/task');
const router = new express.Router();

// const app = express();
// const PORT = process.env.PORT || 3000;
// app.use(express.json());

//Task CRUD
router.post('/task', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
})

router.get('/tasks', async (req,res) => {
  try{
     const tasks = await Task.find({});
    res.send(tasks);
  }catch(e){
    res.status(500).send(e);
  }
})

router.get('/task/:id', async (req,res) => {
    _id = req.params.id;

    try{
      const task = await Task.findById(_id);
      if(!task){
        return res.status(404).send("Error : Invalid id");
      }

      res.send(task);
    }catch(e){
      res.status(500).send(e);
    }
})

router.patch('/task/:id', async (req,res) => {
   const updateKeys = Object.keys(req.body);
   const taskDocumentsKey = ["description","status"];
   const isValidKey = updateKeys.every( (key) => taskDocumentsKey.includes(key));

   if(!isValidKey){
    return res.status(400).send("Error : Invalid Key");
   }

  try{
    const task = await Task.findByIdAndUpdate(req.params.id, req.body , {new:true , runValidators : true});
    res.send(task);
  }catch(e){
    res.status(400).send(e);
  }
})

router.delete('/task/:id', async (req,res) => {
  try{
   const task = await Task.findByIdAndDelete(req.params.id);
   if(!task){
    return res.status(400).send("Error Invalid Id");
   }

   res.send(task);
  }catch(e){
    res.status(400).send(e);
  }
})

module.exports = router