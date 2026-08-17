import nodemailer from 'nodemailer';

/**
 * Sends a StudyVerse branded OTP email for password reset.
 * Uses Gmail SMTP via Nodemailer.
 *
 * @param {string} toEmail  - Recipient email address
 * @param {string} otp      - 6-digit OTP code
 * @param {string} userName - Recipient's display name
 */
const sendPasswordResetEmail = async (toEmail, otp, userName = 'Student') => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>StudyVerse Password Reset</title>
    </head>
    <body style="margin:0; padding:0; background-color:#F8FAFC; font-family:'Segoe UI', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #E2E8F0; box-shadow:0 4px 24px rgba(15,23,42,0.07);">
              
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg, #4F7DF6 0%, #7C3AED 100%); padding:36px 40px; text-align:center;">
                  <table cellpadding="0" cellspacing="0" align="center">
                    <tr>
                      <td style="background:rgba(255,255,255,0.15); border-radius:14px; padding:10px 14px; display:inline-block;">
                        <span style="font-size:22px; font-weight:900; color:#ffffff; letter-spacing:-0.5px;">✦ StudyVerse</span>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:16px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">AI-Powered Learning Platform</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <h2 style="margin:0 0 8px; font-size:22px; font-weight:800; color:#1E293B;">Reset Your Password 🔑</h2>
                  <p style="margin:0 0 24px; font-size:14px; color:#64748B; line-height:1.6;">
                    Hi <strong>${userName}</strong>, we received a request to reset your StudyVerse password.
                    Use the 6-digit code below. It expires in <strong>10 minutes</strong>.
                  </p>

                  <!-- OTP Box -->
                  <div style="background:#EEF4FF; border:1.5px solid #C7D9FF; border-radius:16px; padding:28px; text-align:center; margin:0 0 28px;">
                    <p style="margin:0 0 8px; font-size:12px; color:#4F7DF6; font-weight:700; letter-spacing:1px; text-transform:uppercase;">Your Verification Code</p>
                    <span style="font-size:42px; font-weight:900; letter-spacing:16px; color:#1E293B; font-variant-numeric:tabular-nums;">${otp}</span>
                  </div>

                  <div style="background:#FFF8F0; border:1px solid #FFE4C0; border-radius:12px; padding:16px; margin-bottom:28px;">
                    <p style="margin:0; font-size:13px; color:#92400E; line-height:1.5;">
                      ⚠️ <strong>Didn't request this?</strong> Ignore this email — your account remains safe. 
                      Never share this code with anyone.
                    </p>
                  </div>

                  <p style="margin:0; font-size:13px; color:#94A3B8; text-align:center;">
                    This code expires in 10 minutes • StudyVerse Security Team
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 40px; border-top:1px solid #F1F5F9; text-align:center;">
                  <p style="margin:0; font-size:12px; color:#94A3B8;">
                    © 2026 StudyVerse. All rights reserved. &nbsp;|&nbsp;
                    <a href="#" style="color:#4F7DF6; text-decoration:none;">Privacy Policy</a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"StudyVerse 🎓" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${otp} is your StudyVerse password reset code`,
    html: htmlBody,
  });
};

export default sendPasswordResetEmail;
