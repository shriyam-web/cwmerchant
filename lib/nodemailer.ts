import nodemailer from "nodemailer";

const { EMAIL_USER, EMAIL_PASS } = process.env;

if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const sendEmail = async ({ to, subject, html, text }: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: `"CItywitty Merchant Hub" <${EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || "Please view this email in an HTML compatible client.",
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Email sending error:", err);
    throw err;
  }
};

export default sendEmail;
