const nodemailer = require("nodemailer");

const sendMailToUser = async () => {

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
 // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  // let transporter = await nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: 'terrell.spencer@ethereal.email',
  //     pass: 'z7bxf5DbQExaXjMzDb'
  //   },
  // });

  // send mail with defined transport object
  let info = {
    from: 'pratik75100@gmail.com', // sender address
    to: `gotipratik8418@gmail.com`, // list of receivers
    subject: "Welcome to Task Manager App", // Subject line
    text: `Hello xyz, Welcome to my App. Thank you for signUp`  // plain text body
  }
//sendWelcome is not a function
nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {  //pratik75100@gmail.com
    // user: 'terrell.spencer@ethereal.email',
    // pass: 'z7bxf5DbQExaXjMzDb'
    user: 'pratik75100@gmail.com',
    pass: 'Ph@1328117'
  }
}).sendMail(info, function(err, data) {
    if(err) {
        console.log('Error Occurs');
    } else {
        console.log('Email sent successfully');
    }
});
}

//sendWelcome().catch(console.error);

module.exports = {
  sendMailToUser
}