const bcrypt = require('bcrypt');
const generatetoken = require("../utils/generateTokens");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const recruiterSignup = async (req, res) => {
    const { full_name, email, password, company_name, company_info } = req.body;

    if (!full_name || !email || !password || !company_name) {
        return res.status(400).send({ message: "Please provide all required fields" });
    }

    try {
        
        const existingRecruiter = await prisma.recruiter.findUnique({ where: { email } });
        if (existingRecruiter) {
            return res.status(400).send({ message: "Recruiter already exists" });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const user = await prisma.user.create({
            data: {
                full_name,
                email,
                password: hashedPassword,
                user_type: "recruiter",
                date_joined: new Date()
            }
        });

       
        let company = await prisma.company.findFirst({ where: { company_name } });
        if (!company) {
            company = await prisma.company.create({
                data: {
                    company_name,
                    company_info
                }
            });
        }


        const recruiter = await prisma.recruiter.create({
            data: {
                user_id: user.user_id,
                full_name,
                email,
                password: hashedPassword,
                company_id: company.company_id,
                date_joined: new Date()
            }
        });

        res.status(201).json({
            status: true,
            message: "Recruiter registered successfully",
            recruiter
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};


const recruiterLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Please provide email and password" });
    }

    try {
        const recruiter = await prisma.recruiter.findUnique({ where: { email } });
        if (!recruiter) {
            return res.status(404).send({ message: "Recruiter not found" });
        }
 
        const validPassword = await bcrypt.compare(password, recruiter.password);
        if (!validPassword) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const token = generatetoken(recruiter);

        return res.status(200).json({
            message: "Login successful",
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};

module.exports = { recruiterSignup, recruiterLogin };
