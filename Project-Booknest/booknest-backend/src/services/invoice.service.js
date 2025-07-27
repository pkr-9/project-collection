import pdf from "pdf-creator-node";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Order } from "../models/order.model.js";
import sanitizeHtml from "sanitize-html";
import { logger } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(__dirname, "../templates/invoiceTemplate.html");

const defaultPdfOptions = {
  format: "A4",
  orientation: "portrait",
  border: "10mm",
};

const sanitizeOrder = (order) => {
  const cleanText = (text) =>
    sanitizeHtml(text || "", { allowedTags: [], allowedAttributes: {} });

  const safeOrder = {
    ...order.toObject(),
    contactPerson: cleanText(order.contactPerson),
    shippingAddress: {
      street: cleanText(order.shippingAddress?.street),
      city: cleanText(order.shippingAddress?.city),
      state: cleanText(order.shippingAddress?.state),
      zip: cleanText(order.shippingAddress?.zip),
    },
    orderItem: order.orderItem.map((item) => ({
      quantity: item.quantity,
      bookId: item.bookId
        ? {
            title: cleanText(item.bookId.title),
          }
        : { title: "Unknown Book" },
    })),
  };

  return safeOrder;
};

export const generateInvoicePDF = async (orderId, options = {}) => {
  try {
    const order = await Order.findById(orderId).populate("orderItem.bookId");
    if (!order) throw new Error("Order not found");

    const htmlTemplate = fs.readFileSync(templatePath, "utf8");
    const data = {
      order: sanitizeOrder(order),
      date: new Date().toLocaleDateString(),
    };

    const document = {
      html: htmlTemplate,
      data,
      type: "buffer",
    };

    return await pdf.create(document, { ...defaultPdfOptions, ...options });
  } catch (error) {
    logger.error("Invoice PDF generation failed:", error);
    throw error;
  }
};
