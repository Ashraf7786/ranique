import PDFDocument from 'pdfkit';

// Helper to convert number to Indian Currency words (e.g. Rupees Nine Hundred and Fifty Only)
function numberToWords(num: number): string {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function g(n: number): string {
    if (n < 20) return a[n];
    const digit = n % 10;
    return b[Math.floor(n / 10)] + (digit ? '-' + a[digit] : '');
  }

  function h(n: number): string {
    if (n === 0) return '';
    let str = '';
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (str !== '') str += 'and ';
      str += g(n);
    }
    return str;
  }

  if (num === 0) return 'Rupees Zero Only';

  let result = '';
  let temp = num;

  const crores = Math.floor(temp / 10000000);
  temp %= 10000000;
  if (crores > 0) {
    result += h(crores) + ' Crore ';
  }

  const lakhs = Math.floor(temp / 100000);
  temp %= 100000;
  if (lakhs > 0) {
    result += h(lakhs) + ' Lakh ';
  }

  const thousands = Math.floor(temp / 1000);
  temp %= 1000;
  if (thousands > 0) {
    result += h(thousands) + ' Thousand ';
  }

  if (temp > 0) {
    result += h(temp);
  }

  return `Rupees ${result.trim()} Only`;
}

export function generateInvoicePdf(order: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    const brandRose = '#b76e79';
    const textInk = '#1a1a2e';
    const grayText = '#4b5563';
    const lightGray = '#f9fafb';
    const borderCol = '#e5e7eb';

    const orderId = order.id.slice(0, 8).toUpperCase();
    const customerName = order.shippingName || order.user?.firstName || "Customer";
    
    // Formatting Dates
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
    const invoiceDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    // ─── Header Section ──────────────────────────────────────────────────────────
    doc
      .fillColor(brandRose)
      .fontSize(26)
      .font('Helvetica-Bold')
      .text('RANIQUE', 40, 40)
      .fontSize(10)
      .font('Helvetica')
      .fillColor(grayText)
      .text('Premium Cosmetics & Accessories', 40, 70);

    doc
      .fillColor(textInk)
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('TAX INVOICE', 350, 40, { align: 'right' })
      .fontSize(9)
      .font('Helvetica')
      .fillColor(grayText)
      .text(`Invoice No: RAN-${orderId}`, 350, 68, { align: 'right' })
      .text(`Invoice Date: ${invoiceDate}`, 350, 82, { align: 'right' });

    // Header Separator Line
    doc.moveTo(40, 100).lineTo(555, 100).strokeColor(borderCol).lineWidth(1).stroke();

    // ─── Seller vs Order Info Section ────────────────────────────────────────────
    doc
      .fillColor(textInk)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('SOLD BY (SELLER):', 40, 115)
      .font('Helvetica')
      .fillColor(grayText)
      .fontSize(9)
      .text('Ranique Store', 40, 130, { lineGap: 3 })
      .text('GSTIN: 10AVTPV6245L1ZX', 40, 143, { lineGap: 3 })
      .text('Email: customercare@ranique.in', 40, 156, { lineGap: 3 })
      .text('Website: www.ranique.in', 40, 169);

    doc
      .fillColor(textInk)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('ORDER DETAILS:', 350, 115)
      .font('Helvetica')
      .fillColor(grayText)
      .fontSize(9)
      .text(`Order ID: #${order.id}`, 350, 130, { width: 205, lineGap: 3 })
      .text(`Order Date: ${orderDate}`, 350, 156, { lineGap: 3 })
      .text(`Payment Mode: ${order.paymentMethod || 'ONLINE'}`, 350, 169);

    // Section Separator Line
    doc.moveTo(40, 195).lineTo(555, 195).strokeColor(borderCol).stroke();

    // ─── Billing / Shipping Section ──────────────────────────────────────────────
    doc
      .fillColor(textInk)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('BILL TO (BUYER):', 40, 210)
      .font('Helvetica')
      .fillColor(grayText)
      .fontSize(9)
      .text(customerName, 40, 225, { lineGap: 3 })
      .text(order.shippingLine1 || '', 40, 238, { lineGap: 3 })
      .text(order.shippingLine2 || '', 40, 251, { lineGap: 3 })
      .text(`${order.shippingCity || ''}, ${order.shippingState || ''} - ${order.shippingZip || ''}`, 40, 264, { lineGap: 3 })
      .text(`Contact: ${order.shippingPhone || ''} | ${order.shippingEmail || ''}`, 40, 277);

    // Section Separator Line
    doc.moveTo(40, 305).lineTo(555, 305).strokeColor(borderCol).stroke();

    // ─── Items Table Header ──────────────────────────────────────────────────────
    const tableTop = 320;
    doc
      .rect(40, tableTop, 515, 20)
      .fill(lightGray);

    doc
      .fillColor(textInk)
      .font('Helvetica-Bold')
      .fontSize(9)
      .text('S.No', 50, tableTop + 6)
      .text('Description of Item', 90, tableTop + 6)
      .text('Qty', 350, tableTop + 6, { align: 'right', width: 30 })
      .text('Price (INR)', 400, tableTop + 6, { align: 'right', width: 60 })
      .text('Total (INR)', 485, tableTop + 6, { align: 'right', width: 60 });

    // Table Lines
    doc.moveTo(40, tableTop).lineTo(555, tableTop).strokeColor(borderCol).stroke();
    doc.moveTo(40, tableTop + 20).lineTo(555, tableTop + 20).stroke();

    // ─── Items Render ────────────────────────────────────────────────────────────
    let currentY = tableTop + 20;
    
    if (order.items && order.items.length > 0) {
      order.items.forEach((item: any, idx: number) => {
        const itemTitle = item.product?.title || 'Product';
        const price = item.price || 0;
        const qty = item.quantity || 0;
        const total = price * qty;

        // Auto wrap product titles if they are long
        doc
          .fillColor(textInk)
          .font('Helvetica')
          .fontSize(9)
          .text(String(idx + 1), 50, currentY + 8)
          .text(itemTitle, 90, currentY + 8, { width: 250 })
          .text(String(qty), 350, currentY + 8, { align: 'right', width: 30 })
          .text(`₹${price.toLocaleString()}`, 400, currentY + 8, { align: 'right', width: 60 })
          .text(`₹${total.toLocaleString()}`, 485, currentY + 8, { align: 'right', width: 60 });

        const textHeight = doc.heightOfString(itemTitle, { width: 250 });
        const rowHeight = Math.max(textHeight + 14, 28);

        currentY += rowHeight;

        // Row Separator Line
        doc.moveTo(40, currentY).lineTo(555, currentY).strokeColor(borderCol).stroke();
      });
    }

    // ─── Financial Summary Block ──────────────────────────────────────────────────
    const subtotal = order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) ?? 0;
    const couponDiscount = order.couponDiscount || 0;
    const firstOrderDiscount = order.firstOrderDiscount || 0;
    const shipping = subtotal > 999 ? 0 : 99;
    const finalTotal = order.totalAmount;

    // Check if space left is too small, start new page if necessary
    if (currentY > 600) {
      doc.addPage();
      currentY = 50;
    }

    // Left side info
    doc
      .fillColor(textInk)
      .font('Helvetica-Bold')
      .fontSize(9)
      .text('Amount in Words:', 40, currentY + 15)
      .font('Helvetica')
      .fillColor(grayText)
      .text(numberToWords(finalTotal), 40, currentY + 28, { width: 250, lineGap: 3 });

    // Right side breakdown
    const summaryX = 350;
    let sumY = currentY + 15;

    const addSummaryRow = (label: string, value: string, isGreen = false, isBold = false) => {
      doc
        .fillColor(isGreen ? '#10b981' : isBold ? textInk : grayText)
        .font(isBold ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(9)
        .text(label, summaryX, sumY)
        .text(value, 480, sumY, { align: 'right', width: 65 });
      sumY += 16;
    };

    addSummaryRow('Subtotal:', `₹${subtotal.toLocaleString()}`);
    if (couponDiscount > 0) {
      addSummaryRow(`Coupon Discount (${order.couponCode || 'Promo'}):`, `-₹${couponDiscount.toLocaleString()}`, true);
    }
    if (firstOrderDiscount > 0) {
      addSummaryRow('First Order Discount:', `-₹${firstOrderDiscount.toLocaleString()}`, true);
    }
    addSummaryRow('Shipping Charges:', shipping === 0 ? 'FREE' : `₹${shipping}`);
    
    // Grand Total Line
    doc.moveTo(summaryX, sumY).lineTo(555, sumY).strokeColor(borderCol).stroke();
    sumY += 8;
    addSummaryRow('Grand Total:', `₹${finalTotal.toLocaleString()}`, false, true);

    // ─── Footer Terms & Notes ────────────────────────────────────────────────────
    const footerY = 730;
    doc.moveTo(40, footerY - 10).lineTo(555, footerY - 10).strokeColor(borderCol).stroke();

    doc
      .fillColor(grayText)
      .font('Helvetica')
      .fontSize(8)
      .text('Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.', 40, footerY, { align: 'center', width: 515 })
      .text('This is a computer generated invoice and does not require a physical signature.', 40, footerY + 15, { align: 'center', width: 515 });

    doc.end();
  });
}
