const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // For Gmail
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
      }
    });
  }

  // For other SMTP services
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'SSVGI'} <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  // User creation email
  userCreated: (userData) => {
    return {
      subject: 'Welcome to SSVGI - Your Account Details',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .credentials { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
            .credentials h3 { margin-top: 0; color: #667eea; }
            .credential-item { margin: 10px 0; }
            .credential-label { font-weight: bold; color: #555; }
            .credential-value { background: #e8f0fe; padding: 8px 12px; border-radius: 4px; display: inline-block; font-family: monospace; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Welcome to SSVGI!</h1>
              <p>Your Student Account Has Been Created</p>
            </div>
            <div class="content">
              <p>Dear <strong>${userData.name}</strong>,</p>

              <p>Congratulations! Your admission has been approved and your student account has been successfully created at Shri Satya Sai Vidhi Gyan Institute.</p>

              <div class="credentials">
                <h3>📋 Your Login Credentials</h3>

                <div class="credential-item">
                  <span class="credential-label">🆔 Student ID:</span><br>
                  <span class="credential-value">${userData.studentId || 'N/A'}</span>
                </div>

                <div class="credential-item">
                  <span class="credential-label">📝 Enrollment Number:</span><br>
                  <span class="credential-value">${userData.enrollmentNumber || 'N/A'}</span>
                </div>

                <div class="credential-item">
                  <span class="credential-label">📧 Email (Username):</span><br>
                  <span class="credential-value">${userData.email}</span>
                </div>

                <div class="credential-item">
                  <span class="credential-label">🔐 Password:</span><br>
                  <span class="credential-value">${userData.password}</span>
                </div>

                <div class="credential-item">
                  <span class="credential-label">📚 Course:</span><br>
                  <span class="credential-value">${userData.course || 'N/A'}</span>
                </div>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong> Please change your password after your first login for security purposes.
              </div>

              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">
                  🚀 Login to Your Dashboard
                </a>
              </div>

              <h3>📱 Next Steps:</h3>
              <ol>
                <li>Login to your student dashboard using the credentials above</li>
                <li>Complete your profile information</li>
                <li>View your course details and schedule</li>
                <li>Access study materials and resources</li>
              </ol>

              <p>If you have any questions or need assistance, please contact our support team.</p>

              <p>Best regards,<br>
              <strong>SSVGI Administration Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} Shri Satya Sai Vidhi Gyan Institute. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  },

  // Payment receipt email
  paymentReceipt: (paymentData) => {
    return {
      subject: `Payment Receipt - ${paymentData.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .receipt { background: white; padding: 25px; border: 2px solid #11998e; border-radius: 8px; margin: 20px 0; }
            .receipt-header { border-bottom: 2px solid #11998e; padding-bottom: 15px; margin-bottom: 20px; }
            .receipt-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #ddd; }
            .receipt-label { font-weight: bold; color: #555; }
            .receipt-value { color: #333; }
            .total { background: #e8f5e9; padding: 15px; border-radius: 5px; margin-top: 15px; }
            .total-amount { font-size: 24px; font-weight: bold; color: #11998e; }
            .success-badge { background: #4caf50; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💳 Payment Successful!</h1>
              <p>Thank you for your payment</p>
            </div>
            <div class="content">
              <p>Dear <strong>${paymentData.userName}</strong>,</p>

              <p>Your payment has been successfully processed. Here are your payment details:</p>

              <div class="receipt">
                <div class="receipt-header">
                  <h2 style="margin: 0; color: #11998e;">Payment Receipt</h2>
                  <span class="success-badge">✓ PAID</span>
                </div>

                <div class="receipt-item">
                  <span class="receipt-label">Receipt Number:</span>
                  <span class="receipt-value">${paymentData.receiptId}</span>
                </div>

                <div class="receipt-item">
                  <span class="receipt-label">Order ID:</span>
                  <span class="receipt-value">${paymentData.orderId}</span>
                </div>

                <div class="receipt-item">
                  <span class="receipt-label">Payment ID:</span>
                  <span class="receipt-value">${paymentData.paymentId}</span>
                </div>

                <div class="receipt-item">
                  <span class="receipt-label">Date & Time:</span>
                  <span class="receipt-value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                </div>

                <div class="receipt-item">
                  <span class="receipt-label">Course/Item:</span>
                  <span class="receipt-value">${paymentData.courseName}</span>
                </div>

                <div class="receipt-item">
                  <span class="receipt-label">Payment Method:</span>
                  <span class="receipt-value">${paymentData.method || 'Online'}</span>
                </div>

                <div class="total">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 18px; font-weight: bold;">Total Amount Paid:</span>
                    <span class="total-amount">₹${paymentData.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <p><strong>📚 Course Access:</strong> Your course has been activated and you can now access all the study materials from your dashboard.</p>

              <p>If you have any questions regarding this payment, please contact our support team with your receipt number.</p>

              <p>Thank you for choosing SSVGI!</p>

              <p>Best regards,<br>
              <strong>SSVGI Accounts Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated receipt. Please save this email for your records.</p>
              <p>&copy; ${new Date().getFullYear()} Shri Satya Sai Vidhi Gyan Institute. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }
};

module.exports = {
  sendEmail,
  emailTemplates
};
