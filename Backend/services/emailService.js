import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ============================================
// EMAIL SERVICE
// ============================================

/**
 * Create email transporter
 */
const createTransporter = () => {
  // Using Gmail (you can configure other providers)
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send email
 */
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.response}`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err);
    throw err;
  }
};

// ============================================
// EMAIL TEMPLATES
// ============================================

/**
 * Comment notification email
 */
export const sendCommentNotification = async (userEmail, userName, snippetTitle, commentText, snippetUrl) => {
  const html = `
    <h2>New Comment on Your Snippet</h2>
    <p>Hi ${userName},</p>
    <p>Someone commented on your snippet: <strong>${snippetTitle}</strong></p>
    <p><em>"${commentText}"</em></p>
    <p><a href="${snippetUrl}">View snippet</a></p>
  `;

  return sendEmail(userEmail, "New Comment on Your Snippet", html);
};

/**
 * Like notification email
 */
export const sendLikeNotification = async (userEmail, userName, snippetTitle, snippetUrl) => {
  const html = `
    <h2>Someone Liked Your Snippet</h2>
    <p>Hi ${userName},</p>
    <p>Your snippet <strong>${snippetTitle}</strong> received a like!</p>
    <p><a href="${snippetUrl}">View snippet</a></p>
  `;

  return sendEmail(userEmail, "Someone Liked Your Snippet", html);
};

/**
 * Follow notification email
 */
export const sendFollowNotification = async (userEmail, userName, followerName) => {
  const html = `
    <h2>New Follower</h2>
    <p>Hi ${userName},</p>
    <p><strong>${followerName}</strong> started following you!</p>
  `;

  return sendEmail(userEmail, "New Follower", html);
};

/**
 * Welcome email
 */
export const sendWelcomeEmail = async (userEmail, userName) => {
  const html = `
    <h2>Welcome to CodeShare!</h2>
    <p>Hi ${userName},</p>
    <p>Welcome to CodeShare - the platform for sharing and collaborating on code snippets.</p>
    <p>Get started by creating your first snippet!</p>
    <p><a href="https://codeshare.com/create">Create Snippet</a></p>
  `;

  return sendEmail(userEmail, "Welcome to CodeShare", html);
};

/**
 * Password reset email
 */
export const sendPasswordResetEmail = async (userEmail, userName, resetLink) => {
  const html = `
    <h2>Password Reset Request</h2>
    <p>Hi ${userName},</p>
    <p>We received a request to reset your password.</p>
    <p><a href="${resetLink}">Reset Password</a></p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return sendEmail(userEmail, "Password Reset Request", html);
};

/**
 * Discussion resolved email
 */
export const sendDiscussionResolvedEmail = async (userEmail, userName, snippetTitle, snippetUrl) => {
  const html = `
    <h2>Discussion Resolved</h2>
    <p>Hi ${userName},</p>
    <p>A discussion on your snippet <strong>${snippetTitle}</strong> has been resolved.</p>
    <p><a href="${snippetUrl}">View snippet</a></p>
  `;

  return sendEmail(userEmail, "Discussion Resolved", html);
};

/**
 * Batch send emails
 */
export const sendBatchEmails = async (recipients, subject, html) => {
  try {
    const results = [];
    for (const email of recipients) {
      try {
        const result = await sendEmail(email, subject, html);
        results.push({ email, success: true, result });
      } catch (err) {
        results.push({ email, success: false, error: err.message });
      }
    }
    return results;
  } catch (err) {
    console.error("❌ Batch email error:", err);
    throw err;
  }
};

export default {
  sendEmail,
  sendCommentNotification,
  sendLikeNotification,
  sendFollowNotification,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendDiscussionResolvedEmail,
  sendBatchEmails,
};
