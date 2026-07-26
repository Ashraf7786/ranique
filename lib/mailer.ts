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
  const isBlinking = (idx: number) => idx === currentIndex ? "animation: blink 1.5s infinite;" : "";

  let itemsHtml = "";
  if (order.items && order.items.length > 0) {
    itemsHtml = order.items.map((item: any) => {
      const img = item.product?.images?.[0]?.url || "https://via.placeholder.com/80";
      
      // Extended details if delivered
      const extendedDetails = status === "DELIVERED" ? `
        <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280;">SKU: ${item.product?.sku || 'N/A'}</p>
        <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280;">Price: ₹${(item.price || 0).toLocaleString()}</p>
      ` : "";

      return `
        <tr>
          <td style="padding: 15px 0; border-bottom: 1px solid #f3f4f6; width: 80px;">
            <img src="${img}" alt="${item.product?.title || 'Product'}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />
          </td>
          <td style="padding: 15px 10px; border-bottom: 1px solid #f3f4f6; text-align: left;">
            <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1f2937;">${item.product?.title || 'Product'}</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280;">Qty: ${item.quantity}</p>
            ${extendedDetails}
          </td>
          <td style="padding: 15px 0; border-bottom: 1px solid #f3f4f6; text-align: right; font-size: 14px; font-weight: 600; color: #1f2937; vertical-align: top;">
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

  let invoiceAttachment = null;
  if (status === "DELIVERED") {
    const invoiceHtml = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937; margin: 0; padding: 40px; }
            h1 { color: #b76e79; text-transform: uppercase; margin: 0 0 10px 0; }
            .header { border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; margin-bottom: 20px; }
            .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background-color: #f9fafb; font-size: 12px; text-transform: uppercase; color: #6b7280; }
            .total { text-align: right; font-size: 18px; font-weight: bold; color: #b76e79; padding-top: 20px; border-top: 2px solid #e5e7eb; }
            .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 50px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Ranique</h1>
            <p><strong>INVOICE</strong></p>
          </div>
          <div class="details">
            <div>
              <p><strong>Billed To:</strong><br/>${customerName}</p>
              ${addressHtml}
            </div>
            <div style="text-align: right;">
              <p><strong>Order ID:</strong> #${orderId}<br/>
              <strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map((item: any) => `
                <tr>
                  <td>${item.product?.title || 'Product'}</td>
                  <td>${item.quantity}</td>
                  <td style="text-align: right;">₹${(item.price || 0).toLocaleString()}</td>
                  <td style="text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>
          <div class="total">Grand Total: ₹${(order.totalAmount || 0).toLocaleString()}</div>
          <div class="footer">Thank you for your purchase from Ranique!</div>
        </body>
      </html>
    `;
    invoiceAttachment = {
      filename: `Invoice_RAN-${orderId}.html`,
      content: invoiceHtml,
      contentType: 'text/html'
    };
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @keyframes blink {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); box-shadow: 0 0 10px #b76e79; }
          100% { opacity: 1; transform: scale(1); }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f9fafb;">
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0; border: 1px solid #e5e7eb;">
      
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
          ${status === "DELIVERED" ? "<br/><br/><strong>Good news!</strong> Your order has been delivered. We have attached your invoice to this email for your records." : ""}
        </p>

        <!-- Connected Timeline -->
        <div style="margin: 40px 0; padding: 20px 0; border-top: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6;">
          <div style="position: relative; max-width: 100%; margin: 0 auto; display: table; width: 100%;">
            <!-- Connecting Line -->
            <div style="position: absolute; top: 12px; left: 12.5%; right: 12.5%; height: 2px; background-color: #e5e7eb; z-index: 0;">
              <div style="height: 100%; background-color: #b76e79; width: ${currentIndex * 33.33}%; transition: width 0.5s ease;"></div>
            </div>
            
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="position: relative; z-index: 1;">
              <tr>
                <td align="center" style="width: 25%; vertical-align: top;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background-color: ${getStepColor(0)}; margin: 0 auto 10px; ${isBlinking(0)}"></div>
                  <div style="font-size: 11px; font-weight: 600; color: ${getTextColor(0)}; text-transform: uppercase;">Pending</div>
                </td>
                <td align="center" style="width: 25%; vertical-align: top;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background-color: ${getStepColor(1)}; margin: 0 auto 10px; ${isBlinking(1)}"></div>
                  <div style="font-size: 11px; font-weight: 600; color: ${getTextColor(1)}; text-transform: uppercase;">Confirmed</div>
                </td>
                <td align="center" style="width: 25%; vertical-align: top;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background-color: ${getStepColor(2)}; margin: 0 auto 10px; ${isBlinking(2)}"></div>
                  <div style="font-size: 11px; font-weight: 600; color: ${getTextColor(2)}; text-transform: uppercase;">Shipped</div>
                </td>
                <td align="center" style="width: 25%; vertical-align: top;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background-color: ${getStepColor(3)}; margin: 0 auto 10px; ${isBlinking(3)}"></div>
                  <div style="font-size: 11px; font-weight: 600; color: ${getTextColor(3)}; text-transform: uppercase;">Delivered</div>
                </td>
              </tr>
            </table>
          </div>
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

      <!-- Footer with Socials -->
      <div style="text-align: center; padding: 40px 30px; background-color: #fcf9f9; border-top: 1px solid #f3f4f6;">
        <h4 style="margin: 0 0 15px; font-size: 16px; color: #1f2937;">Follow Us</h4>
        <p style="margin: 0 0 20px;">
          <a href="https://instagram.com/ranique.official" style="color: #b76e79; text-decoration: none; font-weight: bold; font-size: 14px;">
            @ranique.official
          </a>
          <span style="color: #cbd5e1; margin: 0 10px;">|</span>
          <a href="https://ranique.com" style="color: #b76e79; text-decoration: none; font-weight: bold; font-size: 14px;">
            www.ranique.com
          </a>
        </p>
        <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">Thank you for shopping with Ranique!</p>
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">If you have any questions, reply to this email.</p>
      </div>
    </div>
    </body>
    </html>
  `;

  const mailOptions: any = {
    from: '"Ranique Store" <noreply@ranique.com>',
    to: email,
    subject: `Order #${orderId} is now ${status}`,
    html: html,
  };

  if (invoiceAttachment) {
    mailOptions.attachments = [invoiceAttachment];
  }

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending beautiful order email", error);
    return false;
  }
};
