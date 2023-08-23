import express from "express";

const router = express.Router()

import {
    create,
    getAll,
    get,
    update,
    destroy,
    movementCreate,
    movementGetAll
} from "../controllers/product.js";

import {
    create as createValidator,
    update as updateValidator,
    movement as movementValidator
} from "../validators/product.js";

import {verifyToken} from "../middlewares/auth.js";

router.post('/', [verifyToken, createValidator], create)
router.get('/', verifyToken, getAll)
router.get('/:id', verifyToken, get)
router.put('/:id', [verifyToken, updateValidator], update)
router.delete('/:id', verifyToken, destroy)

router.get("/:id/movement", verifyToken, movementGetAll)
router.post("/movement", [verifyToken, movementValidator], movementCreate)

export default router