import nodemailer from "nodemailer";
import { ENV } from "./env";

export type NotificationPayload = {
  title: string;
  content: string;
};

export async function notifyOwner(payload: NotificationPayload): Promise<boolean> {
  if (!ENV.smtpHost || !ENV.ownerEmail) {
    console.warn("[Notification] SMTP not configured, skipping email notification");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: ENV.smtpHost,
      port: ENV.smtpPort,
      secure: ENV.smtpPort === 465,
      auth: {
        user: ENV.smtpUser,
        pass: ENV.smtpPass,
      },
    });

    await transporter.sendMail({
      from: ENV.smtpUser,
      to: ENV.ownerEmail,
      subject: payload.title,
      text: payload.content,
    });

    return true;
  } catch (error) {
    console.warn("[Notification] Failed to send email:", error);
    return false;
  }
}
