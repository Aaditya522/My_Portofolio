import nodemailer from "nodemailer";

/**
 * Creates and returns a Nodemailer transporter based on environment configuration.
 */
const getTransporter = async () => {
  const user = process.env.EMAIL_USER || "aadityabansal522@gmail.com";
  const pass = process.env.EMAIL_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user,
        pass,
      },
    });
  }

  // Fallback for custom SMTP server
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Auto-generate test SMTP credentials (Ethereal) if no real credentials are set in .env
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log("[Email Service] No EMAIL_PASS set in .env — generated temporary Ethereal test SMTP account.");
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (err) {
    console.warn("[Email Service] Failed to create test SMTP account:", err.message);
    return null;
  }
};

/**
 * Sends contact notification email to portfolio owner (aadityabansal522@gmail.com)
 * AND confirmation email to the user who filled the contact form.
 */
export const sendContactEmails = async ({ name, email, message }) => {
  const ownerEmail = process.env.OWNER_EMAIL || "aadityabansal522@gmail.com";
  const senderEmailUser = process.env.EMAIL_USER || ownerEmail;

  try {
    const transporter = await getTransporter();

    if (!transporter) {
      console.warn("[Email Service] Could not establish email transporter.");
      return { success: false, error: "Email service unconfigured" };
    }

    const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    // 1. Email to Portfolio Owner (Aaditya Bansal)
    const ownerMailOptions = {
      from: `"Portfolio Contact Form" <${senderEmailUser}>`,
      to: ownerEmail,
      replyTo: email,
      subject: `📩 New Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0c10; color: #c5c6c7; padding: 30px; border-radius: 12px;">
          <h2 style="color: #66fcf1; border-bottom: 2px solid #45a29e; padding-bottom: 10px;">New Portfolio Inquiry Received</h2>
          <p style="font-size: 15px;"><strong style="color: #ffffff;">Sender Name:</strong> ${name}</p>
          <p style="font-size: 15px;"><strong style="color: #ffffff;">Sender Email:</strong> <a href="mailto:${email}" style="color: #66fcf1;">${email}</a></p>
          <p style="font-size: 15px;"><strong style="color: #ffffff;">Time Received:</strong> ${timestamp} (IST)</p>
          <div style="background-color: #1f2833; padding: 20px; border-left: 4px solid #66fcf1; border-radius: 6px; margin-top: 15px;">
            <h4 style="margin-top: 0; color: #ffffff;">Message Content:</h4>
            <p style="white-space: pre-wrap; color: #e5e5e5; font-size: 14px; leading-height: 1.6;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #888888; margin-top: 25px;">You can directly hit "Reply" to answer ${name} at ${email}.</p>
        </div>
      `,
    };

    // 2. Confirmation Email to the User
    const userMailOptions = {
      from: `"Aaditya Bansal" <${senderEmailUser}>`,
      to: email,
      subject: `Thank you for reaching out, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; padding: 30px; border-radius: 12px;">
          <h2 style="color: #a855f7; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">Message Received!</h2>
          <p style="font-size: 16px; color: #ffffff;">Hi ${name},</p>
          <p style="font-size: 14px; line-height: 1.6;">Thank you for getting in touch through my portfolio. I have received your message and will review it promptly. I typically respond within 24 hours.</p>
          
          <div style="background-color: #1e293b; padding: 20px; border-left: 4px solid #a855f7; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; tracking: 1px;">Copy of Your Message:</h4>
            <p style="white-space: pre-wrap; color: #cbd5e1; font-size: 14px; margin-bottom: 0;">${message}</p>
          </div>

          <p style="font-size: 14px; margin-top: 25px;">Best regards,<br/><strong style="color: #ffffff; font-size: 16px;">Aaditya Bansal</strong><br/><span style="color: #94a3b8; font-size: 13px;">Software Engineering Intern & Full Stack Developer</span></p>
        </div>
      `,
    };

    // Send both emails in parallel
    const [ownerResult, userResult] = await Promise.allSettled([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    if (ownerResult.status === "fulfilled") {
      console.log(`[Email Service] Notification successfully sent to owner (${ownerEmail}). Message ID:`, ownerResult.value.messageId);
    } else {
      console.error(`[Email Service Error] Failed to send email to owner (${ownerEmail}):`, ownerResult.reason?.message || ownerResult.reason);
    }

    if (userResult.status === "fulfilled") {
      console.log(`[Email Service] Confirmation successfully sent to user (${email}). Message ID:`, userResult.value.messageId);
    } else {
      console.error(`[Email Service Error] Failed to send email to user (${email}):`, userResult.reason?.message || userResult.reason);
    }

    const emailSentSuccessfully = ownerResult.status === "fulfilled" || userResult.status === "fulfilled";

    return {
      success: emailSentSuccessfully,
      ownerSent: ownerResult.status === "fulfilled",
      userSent: userResult.status === "fulfilled",
      ownerError: ownerResult.status === "rejected" ? ownerResult.reason?.message : null,
      userError: userResult.status === "rejected" ? userResult.reason?.message : null,
    };
  } catch (error) {
    console.error("[Email Service Critical Error]:", error);
    return { success: false, error: error.message };
  }
};
