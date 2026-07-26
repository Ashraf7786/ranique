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

export const sendBeautifulOrderEmail = async (order: any) => {
  const email = order.shippingEmail || order.user?.email;
  if (!email) return false;

  const status = order.status;
  const orderId = order.id.slice(0, 8).toUpperCase();
  const customerName = order.shippingName || order.user?.firstName || "Customer";

  if (!process.env.SMTP_HOST) {
    console.log(`\n\n---------------------------------------`);
    console.log(`MOCK BEAUTIFUL EMAIL SENT TO: ${email}`);
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

  // Timeline UI logic
  const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
  const currentIndex = statuses.indexOf(status) !== -1 ? statuses.indexOf(status) : 0;

  const getStepColor = (idx: number) => idx <= currentIndex ? "#b76e79" : "#e5e7eb";
  const getTextColor = (idx: number) => idx <= currentIndex ? "#1f2937" : "#9ca3af";

  let itemsHtml = "";
  if (order.items && order.items.length > 0) {
    itemsHtml = order.items.map((item: any) => {
      const img = item.product?.images?.[0]?.url || "https://via.placeholder.com/80";
      return `
        <tr>
          <td style="padding: 15px 0; border-bottom: 1px solid #f3f4f6;">
            <img src="${img}" alt="${item.product?.title || 'Product'}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />
          </td>
          <td style="padding: 15px 10px; border-bottom: 1px solid #f3f4f6; text-align: left;">
            <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1f2937;">${item.product?.title || 'Product'}</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280;">Qty: ${item.quantity}</p>
          </td>
          <td style="padding: 15px 0; border-bottom: 1px solid #f3f4f6; text-align: right; font-size: 14px; font-weight: 600; color: #1f2937;">
            ₹${(item.price * item.quantity).toLocaleString()}
          </td>
        </tr>
      `;
    }).join('');
  }

  const addressHtml = order.shippingLine1 ? `
    <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.5;">
      ${order.shippingLine1}<br/>
      ${order.shippingLine2 ? order.shippingLine2 + '<br/>' : ''}
      ${order.shippingCity}, ${order.shippingState} ${order.shippingZip}<br/>
      ${order.shippingCountry || 'India'}
    </p>
  ` : `<p style="margin: 0; font-size: 14px; color: #4b5563;">Digital/No address provided</p>`;

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0;">
      
      <!-- Header -->
      <div style="text-align: center; padding: 40px 20px; background-color: #fcf9f9;">
        <h1 style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #b76e79; text-transform: uppercase;">Ranique</h1>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px 30px;">
        <h2 style="margin: 0 0 20px; font-size: 24px; color: #1f2937;">Order Update</h2>
        <p style="margin: 0 0 30px; font-size: 16px; color: #4b5563; line-height: 1.5;">
          Hi ${customerName},<br/><br/>
          Your order <strong>#${orderId}</strong> has been updated. The current status is <strong style="color: #b76e79;">${status}</strong>.
        </p>

        <!-- Timeline -->
        <div style="margin: 40px 0; padding: 20px 0; border-top: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="width: 25%;">
                <div style="width: 24px; height: 24px; border-radius: 50%; background-color: ${getStepColor(0)}; margin: 0 auto 10px;"></div>
                <div style="font-size: 12px; font-weight: 600; color: ${getTextColor(0)}; text-transform: uppercase;">Pending</div>
              </td>
              <td align="center" style="width: 25%;">
                <div style="width: 24px; height: 24px; border-radius: 50%; background-color: ${getStepColor(1)}; margin: 0 auto 10px;"></div>
                <div style="font-size: 12px; font-weight: 600; color: ${getTextColor(1)}; text-transform: uppercase;">Confirmed</div>
              </td>
              <td align="center" style="width: 25%;">
                <div style="width: 24px; height: 24px; border-radius: 50%; background-color: ${getStepColor(2)}; margin: 0 auto 10px;"></div>
                <div style="font-size: 12px; font-weight: 600; color: ${getTextColor(2)}; text-transform: uppercase;">Shipped</div>
              </td>
              <td align="center" style="width: 25%;">
                <div style="width: 24px; height: 24px; border-radius: 50%; background-color: ${getStepColor(3)}; margin: 0 auto 10px;"></div>
                <div style="font-size: 12px; font-weight: 600; color: ${getTextColor(3)}; text-transform: uppercase;">Delivered</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Order Summary -->
        <h3 style="margin: 0 0 20px; font-size: 18px; color: #1f2937;">Order Summary</h3>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding: 15px 0; text-align: right; font-size: 16px; color: #4b5563;">Total</td>
            <td style="padding: 15px 0; text-align: right; font-size: 18px; font-weight: bold; color: #b76e79;">
              ₹${(order.totalAmount || 0).toLocaleString()}
            </td>
          </tr>
        </table>

        <!-- Shipping Address -->
        <h3 style="margin: 0 0 15px; font-size: 18px; color: #1f2937;">Delivery Details</h3>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
          ${addressHtml}
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 30px; background-color: #fcf9f9; border-top: 1px solid #f3f4f6;">
        <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">Thank you for shopping with Ranique!</p>
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">If you have any questions, reply to this email.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: '"Ranique Store" <noreply@ranique.com>',
    to: email,
    subject: `Order #${orderId} is now ${status}`,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending beautiful order email", error);
    return false;
  }
};
