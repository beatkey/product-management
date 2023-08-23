import joi from "joi"

const login = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().required(),
        password: joi.string().required(),
    });

    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }

    next()
}

export {
    login
}