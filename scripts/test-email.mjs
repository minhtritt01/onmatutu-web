import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { resolve } from "path";

// Parse .env.local manually
const envPath = resolve(process.cwd(), ".env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const user = env.GMAIL_USER;
const pass = env.GMAIL_APP_PASSWORD?.replace(/\s/g, ""); // strip spaces
const to = env.RECIPIENT_EMAIL;

console.log("GMAIL_USER:", user);
console.log("RECIPIENT_EMAIL:", to);
console.log("APP_PASSWORD length:", pass?.length, "(should be 16)");
console.log("");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user, pass },
});

try {
  await transporter.verify();
  console.log("✓ SMTP connection OK");
  await transporter.sendMail({
    from: `"OnMaTuTu" <${user}>`,
    to,
    subject: "[OnMaTuTu] Test email",
    text: "Test thành công! Form chia sẻ câu chuyện đã hoạt động.",
  });
  console.log("✓ Email đã gửi — kiểm tra hộp thư", to);
} catch (err) {
  console.error("✗ Lỗi:", err.message);
}
