import pdf from "pdf-creator-node";
import fs from "fs";

export const createPDFBuffer = async (htmlTemplate, data, options = {}) => {
  const document = {
    html: htmlTemplate,
    data,
    type: "buffer",
  };

  const pdfOptions = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    ...options,
  };

  return await pdf.create(document, pdfOptions);
};
