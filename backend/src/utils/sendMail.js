const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});

const sendMail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: {
        name: process.env.USER,
        address: process.env.USER,
      },
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });
  } catch (error) {
    throw error;
  }
};

module.exports = sendMail;
