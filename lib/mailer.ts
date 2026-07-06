import nodemailer from 'nodemailer';

// Create a transporter using SMTP or a mock for development
export const sendOTP = async (email: string, otp: string) => {
  // If no SMTP configured, we just mock the email sending (perfect for dev)
  if (!process.env.SMTP_HOST) {
    console.log(`\n\n---------------------------------------`);
    console.log(`MOCK EMAIL SENT TO: ${email}`);
    console.log(`YOUR VERIFICATION OTP IS: ${otp}`);
    console.log(`---------------------------------------\n\n`);
    return true;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: '"Ranique Store" <noreply@ranique.com>',
    to: email,
    subject: 'Your Verification Code',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Verify your email address</h2>
        <p>Your one-time password (OTP) is:</p>
        <h1 style="font-size: 32px; letter-spacing: 4px; color: #b76e79;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email", error);
    return false;
  }
};

export const sendOrderNotification = async (email: string, orderId: string, status: string, amount: number) => {
  if (!process.env.SMTP_HOST) {
    console.log(`\n\n---------------------------------------`);
    console.log(`MOCK EMAIL SENT TO: ${email}`);
    console.log(`ORDER ${orderId} STATUS CHANGED TO: ${status}`);
    console.log(`---------------------------------------\n\n`);
    return true;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: '"Ranique Store" <noreply@ranique.com>',
    to: email,
    subject: `Update on your Ranique Order #${orderId.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Order Status Update</h2>
        <p>Great news! The status of your order <strong>#${orderId.slice(0, 8).toUpperCase()}</strong> has been updated to:</p>
        <h1 style="font-size: 28px; color: #b76e79;">${status}</h1>
        <p>Total Amount: ₹${amount.toLocaleString()}</p>
        <p>Thank you for shopping with Ranique!</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending order notification email", error);
    return false;
  }
};
