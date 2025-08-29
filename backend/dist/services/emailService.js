"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
async function sendEmail({ to, subject, templateName, templateData, }) {
    // 1. Setup transporter (example using Gmail, replace with your SMTP details)
    const transporter = nodemailer_1.default.createTransport({
        // service: "gmail",
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
            user: "95c368001@smtp-brevo.com",
            pass: "2rMSOcYLyV4pfTRa",
        },
    });
    // 2. Render EJS template
    const templatePath = path_1.default.join(__dirname, "..", "templates", `${templateName}.ejs`);
    const html = await ejs_1.default.renderFile(templatePath, templateData);
    // 3. Send email
    const mailOptions = {
        from: "quillcrafts1@gmail.com",
        to,
        subject,
        html,
    };
    return transporter.sendMail(mailOptions);
}
