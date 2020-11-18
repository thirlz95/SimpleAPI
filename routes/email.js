const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');
//const auth = require('../middleware/auth');

router.post(
  '/',
  [
    check('name', 'name is required')
      .not()
      .isEmpty(),
    check('email', 'Please use your Accenture email adddress').isEmail(),
    check('emailMessage', 'Please add a valid message')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    console.log('body', req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let testAccount = await nodemailer.createTestAccount();
      console.log('testAccount', testAccount);
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass // generated ethereal password
        }
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Simplistic Express API Email Service" <foo@example.com>', // sender address, add your desired sender email here
        to: 'john.thirlaway@accenture.com, john.thirlaway@accenture.com', // list of receivers, this could be desired linked to a contacts file
        subject: 'Message Successful', // Subject line
        text: req.body.emailMessage, // plain text body
        html: '<b>Hello world?</b>' // html body
      });

      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      res.send().json({ msg: 'success' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
