const express = require('express');
const User = require('../model/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');

// const app = express();
// const PORT = process.env.PORT || 3000;
// app.use(express.json());

// User CRUD
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
  // user.save().then( () => {
  //     res.send(user);
  // }).catch( (e) => {
  //     res.status(400).send(e);
  // })
})

router.get('/users/myProfile', auth , async (req, res) => {
    res.send(req.user);

  // try {
  //   const users = await User.find({});
  //   res.send(users);
  // } catch (e) {
  //   res.status(500).send(e);
  // }

  //  User.find({}).then( (user) => {
  //      res.send(user);
  //  }).catch( (e) => {
  //      res.status(500).send(e);
  //  })
})

router.get('/users/:id', async (req, res) => {
  _id = req.params.id;

  try {
    const user = await User.findById(_id);
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }

  // User.findById(_id).then( (user) => {
  //    res.send(user);
  // }).catch( (e) => {
  //    res.status(500).send(e);
  // })
})

router.patch('/user/myProfile', auth , async (req,res) => {
  const updateKeys = Object.keys(req.body);
  const documentsKeys = ["name", "email", "age","password"];
  const isValidKey = updateKeys.every((key) => documentsKeys.includes(key));

  if (!isValidKey) {
    return res.status(400).send("Eroor : invalid key");
  }

  try {
    //const user = await User.findById(req.params.id);

    updateKeys.forEach( (update) => req.user[update] = req.body[update] )
    await req.user.save();
   
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }

})

router.patch('/users/:id', async (req, res) => {
  const updateKeys = Object.keys(req.body);
  const documentsKeys = ["name", "email", "age", "password"];
  const isValidKey = updateKeys.every((key) => documentsKeys.includes(key));

  if (!isValidKey) {
    return res.status(400).send("Eroor : invalid key");
  }

  try {
    const user = await User.findById(req.params.id);

    updateKeys.forEach( (update) => user[update] = req.body[update] )
    await user.save();
    //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }

})


router.delete('/user/myProfile', auth , async (req, res) => {
  try {

    // const user = await User.findByIdAndDelete(req.params.id); -- WITHOUT use of auth middleware
    // const user = await User.findByIdAndDelete(req.user._id);   --with use of auth middleware

    // if (!user) {
    //   return res.status(400).send("Error invalid user");
    // }

    await req.user.remove();  //same output as upper code

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
})

router.post('/user/login', async (req,res) => {
 
   try{
  
      const user = await User.findByCredentials(req.body.email,req.body.password);
      const token = await user.generateAuthToken()
      res.send({user,token});
   }catch (e) {
      res.status(400).send(e);
   }
})

const upload = multer({
  dest : 'avatars',
  limits : {
    fileSize : 1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
          cb(new Error("File must be jpg or png or jprg"));
    }
    cb(undefined,true);
  }
})

router.post('/user/myProfile/avatar', upload.single('avatar'), async (req,res) => {
   res.send();
})

router.post('/user/logout', auth , async (req,res) => {
  try{
   req.user.tokens = req.user.tokens.filter( (token) => {
    return token.token !== req.token
   })

   await req.user.save()

   res.send(req.user);
  }catch (e) {
    res.status(500).send(e);
  }
})

module.exports = router;