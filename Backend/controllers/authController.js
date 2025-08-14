const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generatetoken = require("../utils/generateTokens");
const validator = require("validator");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const signup = async (req, res) => {
    const { full_name, email, password, mobile_no, work_status, user_type } = req.body;

    if (!full_name || !email || !password || !user_type) {
        return res.status(400).send({ message: "Please add all mandatory fields" });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).send({ message: "Please provide correct email" });
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).send({ message: "Please provide strong password" });
    }

    try {
        const userExists = await prisma.user.findUnique({ where: { email } });

        if (userExists) {
            return res.status(400).send({ message: "Email already exists" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                full_name,
                email,
                password,
                password: hashedpassword,
                mobile_no,
                work_status,
                user_type,
                date_joined: new Date()
            }
        });

        res.status(201).json({
            status: true, message: "User registered successfully"
        });
    }
    catch (err) {
        res.status(500).send({message:err});
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All all details" });
    }

    try {
        const userExists = await prisma.user.findUnique({ where:{email} });
        if (!userExists) {
            return res.status(400).json({ message: "No user found" });
        }

        const isvalid = await bcrypt.compare(password, userExists.password);

        if (!isvalid) {
            return res.status(400).json({ message: "Incorrect password" });
        }


        const token = generatetoken(userExists);

        return res.status(200).json({ message: "LoggedIn", token });

    }
    catch (err) {
        res.status(500).send({message: err.message });
    }
}


module.exports = {signup,login}