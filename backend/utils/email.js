const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  if (process.env.SMTP_HOST) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@tutors-uae.com',
      to,
      subject,
      text,
      html,
    });
  } else {
    console.log(`Email: to=${to}, subject=${subject}, text=${text || html}`);
  }
};

module.exports = sendEmail;
