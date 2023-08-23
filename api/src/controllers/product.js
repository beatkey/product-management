import Product from "../models/product.js";
import useSleep from "../helpers/sleep.js";
import Product_movement from "../models/product_movement.js";

const create = async (req, res) => {
    const data = new Product({
        name: req.body.name,
        desc: req.body.desc,
        code: req.body.code,
        stock: req.body.stock,
    });

    try {
        const query = await Product.create(data);
        res.send(query);
    } catch (e) {
        res.status(500).send({
            error: e.message
        });
    }
}

const getAll = async (req, res) => {
    try {
        const pageNumber = req.query.page || 1;
        const pageSize = 5;

        const data = await Product.paginate({}, {
            page: pageNumber,
            limit: pageSize
        })

        const {docs, total, limit, page, pages} = data;

        res.send({
            data: docs,
            total,
            limit,
            currentPage: page,
            pageCount: pages
        });
    } catch (e) {
        res.status(500).send({
            error: e.message
        });
    }
}

const get = async (req, res) => {
    try {
        const id = req.params.id
        const data = await Product.findById(id)

        if (data) {
            res.send(data)
        } else {
            res.status(404).send()
        }
    } catch (e) {
        res.status(500).send({
            error: e.message
        });
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Product.findByIdAndUpdate(id, req.body)

        if (data) {
            res.send(data)
        } else {
            res.status(404).send();
        }
    } catch (e) {
        res.status(500).send({
            error: e.message
        });
    }
}

const destroy = async (req, res) => {
    try {
        const id = req.params.id;
        await useSleep(2000)

        await Product_movement.deleteMany({
            product_id: id
        })
        const data = await Product.findByIdAndDelete(id)

        if (data) {
            res.send(data);
        } else {
            res.status(404).send();
        }
    } catch (e) {
        res.status(500).send({
            error: e.message
        });
    }
}

const movementCreate = async (req, res) => {
    try {
        const {id, desc, type, amount} = req.body
        const product = await Product.findById(req.body.id)
        console.log(id, desc, type, amount, product)

        if (type === "decrease") {
            if (amount > product.stock) {
                return res.status(400).send({
                    error: "Amount more than product stock"
                });
            } else {
                await Product.findByIdAndUpdate(id, {
                    stock: product.stock - parseInt(amount)
                })
            }
        } else if (type === "increase") {
            await Product.findByIdAndUpdate(id, {
                stock: product.stock + parseInt(amount)
            })
        } else {
            res.status(500).send();
        }

        const data = {
            product_id: req.body.id,
            desc: req.body.desc,
            amount: req.body.amount,
            type: req.body.type
        }

        await Product_movement.create(data);
        res.send();
    } catch (e) {
        res.status(500).send({
            error: e.message
        });
    }
}

const movementGetAll = async (req, res) => {
    try {
        const id = req.params.id;
        const pageNumber = req.query.page || 1;
        const pageSize = 5;

        const data = await Product_movement.paginate({
            product_id: id
        }, {
            sort: {
                createdAt: 'desc'
            },
            page: pageNumber,
            limit: pageSize
        })

        const {docs, total, limit, page, pages} = data;

        res.send({
            data: docs,
            total,
            limit,
            currentPage: page,
            pageCount: pages
        });
    } catch (e) {
        res.status(500).send({
            error: e.message
        });
    }
}

export {
    create,
    getAll,
    get,
    update,
    destroy,
    movementCreate,
    movementGetAll
}