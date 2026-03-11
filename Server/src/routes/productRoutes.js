import express from "express";
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStatus,
  getProductStats
} from "../controllers/productController.js";
import { upload } from "../config/cloudinary.js";
import verifyToken from "../middleware/authMiddleware.js";

const productRouter = express.Router();
productRouter.use(verifyToken);
productRouter.get("/", getAllProducts);
productRouter.get("/stats", getProductStats);
productRouter.get("/:id", getProduct);
productRouter.post("/", upload.array("images", 5), createProduct);
productRouter.put("/:id", upload.array("images", 5), updateProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.patch("/:id/status", updateStatus);

export default productRouter;