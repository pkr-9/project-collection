import { generateInvoicePDF } from "../services";
import { sendMail } from "../utils/emailUtils.js";
import { logger } from "../utils/logger.js";

export const downloadInvoice = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const pdfBuffer = await generateInvoicePDF(orderId);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice_${orderId}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    logger.error(
      `Invoice download failed for order ${req.params.orderId}: ${error.message}`
    );
    next(error);
  }
};

export const emailInvoice = async (req, res, next) => {
  try {
    const { orderId, toEmail } = req.body;
    const pdfBuffer = await generateInvoicePDF(orderId);

    await sendMail({
      to: toEmail,
      subject: `Invoice for Order #${orderId}`,
      html: `<p>Please find attached your invoice for order <strong>#${orderId}</strong>.</p>`,
      attachments: [
        {
          filename: `invoice_${orderId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    res.status(200).json({ message: "Invoice sent successfully." });
  } catch (error) {
    logger.error(
      `Invoice email failed for order ${req.body.orderId}: ${error.message}`
    );
    next(error);
  }
};
