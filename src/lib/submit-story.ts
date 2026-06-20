"use server";

import nodemailer from "nodemailer";

export interface SubmitStoryResult {
  success: boolean;
  error?: string;
}

export async function submitStory(
  story: string,
  honeypot: string
): Promise<SubmitStoryResult> {
  if (honeypot) {
    return { success: true };
  }

  const trimmed = story.trim();
  if (trimmed.length < 10) {
    return { success: false, error: "too_short" };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

  await transporter.sendMail({
    from: `"OnMaTuTu" <${process.env.GMAIL_USER}>`,
    to: process.env.RECIPIENT_EMAIL,
    subject: "[OnMaTuTu] Câu chuyện mới từ người dùng",
    text: `Một người đã chia sẻ câu chuyện của họ:\n\n---\n${trimmed}\n---\n\nGửi lúc: ${timestamp}\n\nLưu ý: Câu chuyện này được gửi hoàn toàn ẩn danh. Không có thông tin nào về người gửi được ghi lại.`,
  });

  return { success: true };
}
