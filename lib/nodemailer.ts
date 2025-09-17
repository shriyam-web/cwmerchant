import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
      from: `"CItywitty Merchant Hub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || "Please view this email in an HTML compatible client.",
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Email sending error:", err);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
