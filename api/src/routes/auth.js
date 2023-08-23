import express from "express";

const router = express.Router()

import {
    login
} from "../controllers/auth.js";

import {
    login as loginValidator
} from "../validators/auth.js";

router.post('/login', loginValidator, login)

export default router