import express from "express";
import {
  downloadInvoice,
  emailInvoice,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/:orderId", downloadInvoice);
router.post("/email", emailInvoice);

export default router;
