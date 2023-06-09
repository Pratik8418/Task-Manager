const express = require('express');
const User = require('../model/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp')
// const { sendMailToUser } = require('../mail/account');
const nodemailer = require("nodemailer");

// const app = express();
// const PORT = process.env.PORT || 3000;
// app.use(express.json());

router.post('/mail/test', async (req,res) => {
  try{
    console.log(req.body.email);
    // sendMailToUser;

    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'johanna.feest@ethereal.email',
        pass: 'PR61ndN3e7dueA5gvX'
      },
    });

   
    
    var mailOptions = {
      from: 'johanna.feest@ethereal.email', // sender address
      to: `${req.body.email}`, // list of receivers
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Email sent: ' + info.response)
      }
    });


  }catch (e){
  res.status(400).send("Error " +  e);
  }

})

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
  limits : {
    fileSize : 1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
      return cb(new Error("File must be jpg or png or jprg"));
    }
    cb(undefined,true);
  }
})

router.post('/user/myProfile/avatar',auth, upload.single('avatar'),async (req,res) => {
  // const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  const buffer = await sharp({
    create: {
      width: 48,
      height: 48,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 0.5 }
    }
  }).png().toBuffer();

  req.user.avatar = buffer
  await req.user.save()
   res.send();
}, (error,req,res,next) => {
  res.status(400).send({ error : error.message});
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