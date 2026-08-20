import nodemailer from 'nodemailer';
import { generateInvoicePdf } from './invoice-generator';

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
      // Ensure image is an absolute URL, else fallback to Unsplash premium placeholder
      let img = item.product?.images?.[0]?.url || "";
      if (!img || (!img.startsWith("http://") && !img.startsWith("https://"))) {
        img = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&auto=format&fit=crop&q=60";
      }
      
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

  // ── Calculate payment breakdown details ──────────────────────────────────
  const subtotal = order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) ?? 0;
  const couponDiscount = order.couponDiscount || 0;
  const firstOrderDiscount = order.firstOrderDiscount || 0;
  const discountTotal = couponDiscount + firstOrderDiscount;
  const shipping = subtotal > 999 ? 0 : 99;
  const finalTotal = order.totalAmount;

  // Custom banner and tracker layout for SHIPPED status (Delhivery Logistics)
  let shippingBannerHtml = "";
  if (status === "SHIPPED") {
    const awb = order.deliveryAwb || order.trackingNumber || "N/A";
    const trackingUrl = `https://www.delhivery.com/track/package/${awb}`;

    shippingBannerHtml = `
      <div style="background-color: #fdf2f4; border: 1px solid #fcd5dc; padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: left;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="vertical-align: middle; padding-right: 15px; width: 60px;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Delhivery_Logo.png" alt="Delhivery" style="width: 60px; height: auto;" />
            </td>
            <td style="vertical-align: middle; text-align: left;">
              <h4 style="margin: 0; font-size: 15px; color: #b76e79; font-weight: bold;">Shipped via Delhivery Logistics</h4>
              <p style="margin: 4px 0 0; font-size: 13px; color: #4b5563;">Air Waybill (AWB): <strong style="font-family: monospace; color: #1f2937;">${awb}</strong></p>
            </td>
          </tr>
        </table>
        <p style="margin: 15px 0; font-size: 13px; color: #4b5563; line-height: 1.6;">
          We are trying to deliver your order in fast shipping. Thank you for your patience! You can track your shipment live using the button below.
        </p>
        <div style="text-align: left; margin-top: 10px;">
          <a href="${trackingUrl}" target="_blank" style="background-color: #b76e79; color: #ffffff; padding: 12px 24px; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">
            Track Your Package Live
          </a>
        </div>
      </div>
    `;
  }

  let invoiceAttachment = null;
  if (status === "DELIVERED") {
    try {
      const pdfBuffer = await generateInvoicePdf(order);
      invoiceAttachment = {
        filename: `Invoice_RAN-${orderId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      };
    } catch (pdfErr) {
      console.error('[mailer] Failed to generate PDF invoice:', pdfErr);
    }
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Update - Ranique</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f9fafb;">
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0; border: 1px solid #e5e7eb;">
      
      <!-- Header (Side-by-side Logos for Shipped updates) -->
      <div style="text-align: center; padding: 40px 20px; background-color: #fcf9f9;">
        <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
          <tr>
            <td style="vertical-align: middle;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #b76e79; text-transform: uppercase; line-height: 1;">Ranique</span>
            </td>
            ${status === "SHIPPED" ? `
            <td style="vertical-align: middle; padding: 0 12px; font-size: 24px; color: #cbd5e1; font-weight: 300;">&times;</td>
            <td style="vertical-align: middle;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Delhivery_Logo.png" alt="Delhivery" style="height: 24px; width: auto; display: block; max-height: 24px;" />
            </td>
            ` : ''}
          </tr>
        </table>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px 30px;">
        <h2 style="margin: 0 0 20px; font-size: 24px; color: #1f2937;">Order Update</h2>
        <p style="margin: 0 0 30px; font-size: 16px; color: #4b5563; line-height: 1.5;">
          Hi ${customerName},<br/><br/>
          Your order <strong>#${orderId}</strong> has been updated. The current status is <strong style="color: #b76e79;">${status}</strong>.
          ${status === "DELIVERED" ? "<br/><br/><strong>Good news!</strong> Your order has been delivered. We have attached your invoice to this email for your records." : ""}
        </p>

        <!-- Delhivery Shipping tracking Banner (only visible during Shipped) -->
        ${shippingBannerHtml}

        <!-- Connected Table-based Timeline (Gmail and Outlook compatible) -->
        <div style="margin: 30px 0; padding: 15px 0; border-top: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
            <tr>
              <!-- Step 1 -->
              <td align="center" style="width: 25%; padding-bottom: 8px; border-bottom: 4px solid ${getStepColor(0)};">
                <span style="font-size: 11px; font-weight: bold; color: ${getTextColor(0)}; text-transform: uppercase;">1. Pending</span>
              </td>
              <!-- Step 2 -->
              <td align="center" style="width: 25%; padding-bottom: 8px; border-bottom: 4px solid ${getStepColor(1)};">
                <span style="font-size: 11px; font-weight: bold; color: ${getTextColor(1)}; text-transform: uppercase;">2. Confirmed</span>
              </td>
              <!-- Step 3 -->
              <td align="center" style="width: 25%; padding-bottom: 8px; border-bottom: 4px solid ${getStepColor(2)};">
                <span style="font-size: 11px; font-weight: bold; color: ${getTextColor(2)}; text-transform: uppercase;">3. Shipped</span>
              </td>
              <!-- Step 4 -->
              <td align="center" style="width: 25%; padding-bottom: 8px; border-bottom: 4px solid ${getStepColor(3)};">
                <span style="font-size: 11px; font-weight: bold; color: ${getTextColor(3)}; text-transform: uppercase;">4. Delivered</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Order Summary -->
        <h3 style="margin: 0 0 20px; font-size: 18px; color: #1f2937;">Order Summary</h3>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
          ${itemsHtml}
        </table>

        <!-- Detailed Invoice/Payment breakdown -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 35px; border-top: 1px solid #f3f4f6; padding-top: 15px;">
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #4b5563;">Subtotal</td>
            <td style="padding: 6px 0; text-align: right; font-size: 14px; color: #1f2937;">₹${subtotal.toLocaleString()}</td>
          </tr>
          ${couponDiscount > 0 ? `
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #10b981;">Coupon Discount (${order.couponCode || 'Promo'})</td>
            <td style="padding: 6px 0; text-align: right; font-size: 14px; color: #10b981; font-weight: 600;">-₹${couponDiscount.toLocaleString()}</td>
          </tr>
          ` : ''}
          ${firstOrderDiscount > 0 ? `
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #10b981;">First Order Discount</td>
            <td style="padding: 6px 0; text-align: right; font-size: 14px; color: #10b981; font-weight: 600;">-₹${firstOrderDiscount.toLocaleString()}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #4b5563;">Shipping</td>
            <td style="padding: 6px 0; text-align: right; font-size: 14px; color: #1f2937;">
              ${shipping === 0 ? '<span style="color: #10b981; font-weight: 600;">FREE</span>' : `₹${shipping}`}
            </td>
          </tr>
          <tr>
            <td style="padding: 15px 0 0; font-size: 16px; font-weight: bold; color: #1f2937; border-top: 2px solid #e5e7eb;">Total Paid</td>
            <td style="padding: 15px 0 0; text-align: right; font-size: 18px; font-weight: bold; color: #b76e79; border-top: 2px solid #e5e7eb;">
              ₹${finalTotal.toLocaleString()}
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
          <a href="https://ranique.in" style="color: #b76e79; text-decoration: none; font-weight: bold; font-size: 14px;">
            www.ranique.in
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
