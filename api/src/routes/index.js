import express from "express";
const router = express.Router()
import product from "./product.js"
import auth from "./auth.js"

router.use("/product", product)
router.use("/auth", auth)

export default router