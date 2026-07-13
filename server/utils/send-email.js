const nodemailer = require("nodemailer");

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) throw new Error("Email service is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS in server/.env");
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
};

const escapeHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

const formatMoney = (value) => `INR ${Number(value || 0).toFixed(2)}`;

const sendVerificationEmail = async ({ email, name, code }) => {
  await createTransporter().sendMail({
    from: process.env.MAIL_FROM || `O'Soul <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your O'Soul account",
    text: `Hello ${name}, your O'Soul verification code is ${code}. It expires in 10 minutes.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px"><h1>Welcome to O'Soul</h1><p>Hello ${name},</p><p>Use this verification code to finish creating your account:</p><div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:20px;background:#f4f4ef;text-align:center">${code}</div><p style="color:#666">This code expires in 10 minutes. Do not share it.</p></div>`
  });
};

const sendResetPasswordEmail = async ({ email, name, resetLink }) => {
  await createTransporter().sendMail({
    from: process.env.MAIL_FROM || `O'Soul <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your O'Soul account password",
    text: `Hello ${name}, you requested a password reset. Use this link: ${resetLink}. It expires in 15 minutes.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px"><h1>Password Reset Request</h1><p>Hello ${name},</p><p>We received a request to reset your password. Click the link below to set a new password:</p><div style="text-align:center;margin:32px 0"><a href="${resetLink}" style="background:#222;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold">Reset Password</a></div><p style="color:#666">This link expires in 15 minutes. If you did not request this, you can ignore this email.</p></div>`
  });
};

const sendOrderConfirmationEmails = async ({ order }) => {
  const transporter = createTransporter();
  const from = process.env.MAIL_FROM || `O'Soul <${process.env.SMTP_USER}>`;
  const ownerEmail = process.env.ORDER_NOTIFICATION_EMAIL || process.env.SMTP_USER;
  const customerEmail = order.shippingDetails.email;
  const customerName = `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`.trim();
  const orderNumber = order.razorpayOrderId || String(order._id);

  const itemText = order.items
    .map((item) => `${item.name} x ${item.quantity}${item.size ? ` | Size: ${item.size}` : ""}${item.color ? ` | Color: ${item.color}` : ""} - ${formatMoney(item.price * item.quantity)}`)
    .join("\n");
  const itemRows = order.items
    .map((item) => `<tr>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.name)}${item.size ? `<br><small>Size: ${escapeHtml(item.size)}</small>` : ""}${item.color ? `<br><small>Color: ${escapeHtml(item.color)}</small>` : ""}</td>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:center">${escapeHtml(item.quantity)}</td>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right">${escapeHtml(formatMoney(item.price * item.quantity))}</td>
    </tr>`)
    .join("");
  const address = [
    order.shippingDetails.address,
    order.shippingDetails.apartment,
    order.shippingDetails.city,
    order.shippingDetails.state,
    order.shippingDetails.pincode,
    order.shippingDetails.country
  ].filter(Boolean).join(", ");

  const summaryHtml = `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:32px;color:#111827">
    <h1 style="margin-bottom:8px">Order confirmed</h1>
    <p style="color:#4b5563">Order <strong>${escapeHtml(orderNumber)}</strong></p>
    <table style="width:100%;border-collapse:collapse;margin:24px 0">
      <thead><tr><th style="padding:10px;text-align:left;border-bottom:2px solid #111827">Item</th><th style="padding:10px;border-bottom:2px solid #111827">Qty</th><th style="padding:10px;text-align:right;border-bottom:2px solid #111827">Amount</th></tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <p style="font-size:18px"><strong>Total paid: ${escapeHtml(formatMoney(order.totalAmount))}</strong></p>
    <p><strong>Delivery address:</strong><br>${escapeHtml(address)}</p>
    <p><strong>Contact:</strong> ${escapeHtml(customerEmail)} | ${escapeHtml(order.shippingDetails.phone)}</p>
  </div>`;

  const messages = [
    transporter.sendMail({
      from,
      to: customerEmail,
      subject: `Your O'Soul order is confirmed - ${orderNumber}`,
      text: `Hello ${customerName},\n\nYour payment was successful and your order is confirmed.\n\nOrder: ${orderNumber}\n${itemText}\n\nTotal paid: ${formatMoney(order.totalAmount)}\nDelivery address: ${address}\n\nThank you for shopping with O'Soul.`,
      html: summaryHtml.replace("<h1 style=\"margin-bottom:8px\">Order confirmed</h1>", `<h1 style="margin-bottom:8px">Thank you, ${escapeHtml(customerName)}!</h1><p>Your payment was successful and your order is confirmed.</p>`)
    }),
    transporter.sendMail({
      from,
      to: ownerEmail,
      replyTo: customerEmail,
      subject: `New paid order - ${orderNumber}`,
      text: `A new paid order has been placed.\n\nCustomer: ${customerName}\nEmail: ${customerEmail}\nPhone: ${order.shippingDetails.phone}\nOrder: ${orderNumber}\n${itemText}\n\nTotal paid: ${formatMoney(order.totalAmount)}\nDelivery address: ${address}`,
      html: summaryHtml.replace("<h1 style=\"margin-bottom:8px\">Order confirmed</h1>", `<h1 style="margin-bottom:8px">New paid order</h1><p><strong>Customer:</strong> ${escapeHtml(customerName)}</p>`)
    })
  ];

  const results = await Promise.allSettled(messages);
  const failures = results.filter((result) => result.status === "rejected");
  if (failures.length) {
    throw new Error(`${failures.length} of ${results.length} order notification emails failed`);
  }
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail, sendOrderConfirmationEmails };
