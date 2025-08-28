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
      user: "95c368001@smtp-brevo.com",
      pass: "2rMSOcYLyV4pfTRa",
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
    from: "quillcrafts1@gmail.com",
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}
