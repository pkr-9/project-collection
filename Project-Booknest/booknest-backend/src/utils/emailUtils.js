import transporter from "../config/mailConfig.js";

export const sendMail = async ({ to, subject, html, attachments }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments,
  };

  return await transporter.sendMail(mailOptions);
};
