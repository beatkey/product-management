import joi from "joi"

const create = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().required(),
        desc: joi.string().required(),
        code: joi.string().required(),
        stock: joi.required(),
    });

    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    next()
}

const update = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().required(),
        desc: joi.string().required(),
        code: joi.string().required(),
        stock: joi.required(),
    });

    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    next()
}

const movement = (req, res, next) => {
    const schema = joi.object({
        id: joi.string().required(),
        desc: joi.string().required(),
        amount: joi.number().required(),
        type: joi.string().required(),
    });

    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    next()
}

export {
    create,
    update,
    movement
}