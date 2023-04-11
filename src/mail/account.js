"use strict";
const nodemailer = require("nodemailer");


const sendWelcome = async (email,name) => {

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
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
    from: '"Pratik Goti 👻" <foo@example.com>', // sender address
    to: `${email}`, // list of receivers
    subject: "Welcome to Task Manager App", // Subject line
    text: `Hello ${name}, Welcome to my App. Thank you for signUp`  // plain text body
    // html: "<b>Hello world?</b>", // html body
  });

}

module.exports = {
  sendWelcome
}