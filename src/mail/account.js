"use strict";
const { info } = require("autoprefixer");
const nodemailer = require("nodemailer");


const sendWelcome = async (email,name) => {

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = await nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'terrell.spencer@ethereal.email',
      pass: 'z7bxf5DbQExaXjMzDb'
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendWelcome({
    from: '"Pratik Goti 👻" <terrell.spencer@ethereal.email>', // sender address
    to: `${email}`, // list of receivers
    subject: "Welcome to Task Manager App", // Subject line
    text: `Hello ${name}, Welcome to my App. Thank you for signUp`  // plain text body
    // html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

sendWelcome().catch(console.error);



module.exports = {
  sendWelcome
}
