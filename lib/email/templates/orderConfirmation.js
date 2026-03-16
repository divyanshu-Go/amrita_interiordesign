// lib/email/templates/orderConfirmation.js
// Returns an HTML string for the order confirmation email.

const fmt = (n) =>
  (n ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

/**
 * @param {{ order: object, userEmail: string }} params
 * @returns {{ to: string, subject: string, html: string }}
 */
export function orderConfirmationEmail({ order, userEmail }) {
  const { orderNumber, items, totals, addressSnapshot, paymentMethod, paymentStatus } = order;
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0; border-bottom:1px solid #f3f4f6; vertical-align:top;">
          <strong style="color:#111827; font-size:14px;">${item.productSnapshot?.name ?? "—"}</strong>
          <br/>
          <span style="color:#9ca3af; font-size:12px;">Qty ${item.quantity} × ${item.sellBy}</span>
        </td>
        <td style="padding:10px 0; border-bottom:1px solid #f3f4f6; text-align:right; vertical-align:top; white-space:nowrap;">
          <strong style="color:#111827; font-size:14px;">₹${fmt(item.pricingSnapshot?.lineFinalTotal)}</strong>
          ${
            item.pricingSnapshot?.discountPercent > 0
              ? `<br/><span style="color:#16a34a; font-size:11px;">${item.pricingSnapshot.discountPercent}% off</span>`
              : ""
          }
        </td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background:#f9fafb; font-family: Georgia, 'Times New Roman', serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb; padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f97316, #ea580c); padding:32px 32px 28px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700; letter-spacing:-0.3px;">interio97</h1>
              <p style="margin:8px 0 0; color:#ffedd5; font-size:13px;">Order Confirmed ✓</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:28px 32px 0;">
              <h2 style="margin:0 0 6px; font-size:18px; color:#111827;">Your order is confirmed!</h2>
              <p style="margin:0; color:#6b7280; font-size:14px; line-height:1.6;">
                Thanks for shopping with us. Here's a summary of your order.
              </p>
            </td>
          </tr>

          <!-- Order number box -->
          <tr>
            <td style="padding:20px 32px 0;">
              <div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; padding:14px 18px;">
                <p style="margin:0 0 4px; font-size:11px; color:#9a3412; text-transform:uppercase; letter-spacing:0.5px;">Order Number</p>
                <p style="margin:0; font-size:20px; font-weight:700; color:#c2410c; letter-spacing:1px;">${orderNumber}</p>
              </div>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding:24px 32px 0;">
              <p style="margin:0 0 12px; font-size:13px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:0.5px;">Items Ordered</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding:16px 32px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb; border-radius:8px; padding:16px; border:1px solid #f3f4f6;">
                ${
                  totals.discount > 0
                    ? `<tr>
                        <td style="padding:4px 0; font-size:13px; color:#16a34a;">Discount</td>
                        <td style="padding:4px 0; font-size:13px; color:#16a34a; text-align:right;">−₹${fmt(totals.discount)}</td>
                      </tr>`
                    : ""
                }
                <tr>
                  <td style="padding:4px 0; font-size:13px; color:#6b7280;">Delivery</td>
                  <td style="padding:4px 0; font-size:13px; color:#6b7280; text-align:right;">
                    ${totals.deliveryCharge === 0 ? "FREE" : `₹${fmt(totals.deliveryCharge)}`}
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0 4px; font-size:15px; font-weight:700; color:#111827; border-top:1px solid #e5e7eb;">Total</td>
                  <td style="padding:10px 0 4px; font-size:15px; font-weight:700; color:#ea580c; text-align:right; border-top:1px solid #e5e7eb;">
                    ₹${fmt(totals.grandTotal)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery address -->
          <tr>
            <td style="padding:20px 32px 0;">
              <p style="margin:0 0 8px; font-size:13px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:0.5px;">Delivering to</p>
              <p style="margin:0; font-size:14px; color:#374151; line-height:1.7;">
                <strong>${addressSnapshot.name}</strong><br/>
                ${addressSnapshot.addressLine1}${addressSnapshot.addressLine2 ? ", " + addressSnapshot.addressLine2 : ""}<br/>
                ${addressSnapshot.city}, ${addressSnapshot.state} – ${addressSnapshot.pincode}<br/>
                📞 ${addressSnapshot.phone}
              </p>
            </td>
          </tr>

          <!-- Payment -->
          <tr>
            <td style="padding:16px 32px 0;">
              <p style="margin:0 0 4px; font-size:13px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:0.5px;">Payment</p>
              <p style="margin:0; font-size:14px; color:#6b7280;">
                ${paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"} &nbsp;·&nbsp;
                ${paymentStatus === "paid" ? "✅ Paid" : paymentStatus === "not_required" ? "Pay at delivery" : "⏳ Pending confirmation"}
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:28px 32px;">
              <a href="${appUrl}/orders/${order._id}"
                 style="display:block; background:#f97316; color:#ffffff; text-align:center; padding:14px; border-radius:8px; font-size:14px; font-weight:700; text-decoration:none;">
                View Order Details →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; border-top:1px solid #f3f4f6; padding:20px 32px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#9ca3af;">
                Questions? Reply to this email or contact support.<br/>
                © ${new Date().getFullYear()} interio97. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  return {
    to:      userEmail,
    subject: `Order Confirmed – #${orderNumber}`,
    html,
  };
}