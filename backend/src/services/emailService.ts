import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

interface SendEmailParams {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
}

export async function sendEmail({
  to,
  subject,
  templateName,
  templateData,
}: SendEmailParams) {
  // 1. Setup transporter (example using Gmail, replace with your SMTP details)
  const transporter = nodemailer.createTransport({
    // service: "gmail",
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: "quillcrafts1@gmail.com",
      pass: "D@rya1999",
    },
  });

  // 2. Render EJS template
  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    `${templateName}.ejs`
  );
  const html = await ejs.renderFile(templatePath, templateData);

  // 3. Send email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}
