const nodemailer = require("nodemailer");

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) throw new Error("Email service is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS in server/.env");
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
};

const sendVerificationEmail = async ({ email, name, code }) => {
  await createTransporter().sendMail({
    from: process.env.MAIL_FROM || `O'Soul <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your O'Soul account",
    text: `Hello ${name}, your O'Soul verification code is ${code}. It expires in 10 minutes.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px"><h1>Welcome to O'Soul</h1><p>Hello ${name},</p><p>Use this verification code to finish creating your account:</p><div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:20px;background:#f4f4ef;text-align:center">${code}</div><p style="color:#666">This code expires in 10 minutes. Do not share it.</p></div>`
  });
};

module.exports = { sendVerificationEmail };
