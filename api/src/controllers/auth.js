import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/user.js";
import useSleep from "../helpers/sleep.js";

const login = async (req, res) => {
    try {
        const identifier = req.body.email
        const password = req.body.password

        const data = await User.findOne({
            $or: [
                {username: identifier},
                {email: identifier}
            ]
        });

        if (!data) {
            return res.status(404).send({error: "User Not found."});
        }

        const passwordIsValid = bcrypt.compareSync(
            password,
            data.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                error: "Password is wrong!"
            });
        }

        const token = jwt.sign({id: data.id}, process.env.JWT_SECRET_KEY, {
            expiresIn: 86400,
        });

        res.send({
            username: data.username,
            email: data.email,
            accessToken: token
        });
    } catch (e) {
        res.status(500).send({
            error: e.message
        });
    }
}

export {
    login
}