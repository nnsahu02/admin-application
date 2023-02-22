const userModel = require('../model/userModel')
const nodemailer = require("nodemailer");

const createUser = async (req, res) => {
    try {
        let bodyData = req.body
        let { name, email } = bodyData

        let emailPresent = await userModel.findOne({ email: email })
        if (emailPresent)
            return res.status(400).send({ status: false, message: "Email is already exist" })

        await nodemailer.createTestAccount();

        const transporter = await nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'shemar.reinger@ethereal.email',
                pass: 'eMQ5wwZDvvkDAuZGNh'
            }
        });

        const createOtp = () => {
            let OTP = Math.floor(Math.random() * 9000) + 100;
            return OTP
        }

        let otp = createOtp()
        console.log(otp)

        let info = await transporter.sendMail({
            from: '"Rahul 👻" <Rahul@gmail.com>', // sender address
            to: `${name}, ${email}`, // list of receivers
            subject: "OTP", // Subject line
            text: `the OTP is ${otp}` // plain text body
        });

        bodyData.password = otp

        console.log("Message sent: %s", info.messageId);

        let createData = await userModel.create(bodyData)

        return res.send({ data: createData })

    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

const resendOTP = async (req, res) => {
    try {
        let email = req.body.email
        let OTP = Math.floor(Math.random() * 9000) + 100;

        await userModel.findOneAndUpdate(
            { email: email },
            { $set: { password: OTP } },
            { new: true }
        )

        await nodemailer.createTestAccount();

        const transporter = await nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'shemar.reinger@ethereal.email',
                pass: 'eMQ5wwZDvvkDAuZGNh'
            }
        });

        let info = await transporter.sendMail({
            from: '"Rahul 👻" <Rahul@gmail.com>', // sender address
            to: `${email}`, // list of receivers
            subject: "OTP", // Subject line
            text: `the OTP is ${OTP}` // plain text body
        });

        console.log("Message sent: %s", info.messageId);

        return res.send({ msg: "done" })

    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}


const setPassword = async (req, res) => {
    try {
        let email = req.body.email
        let password = req.body.password
        let otp = req.body.otp


        const userData = await userModel.findOne({ email })

        if (userData.password == otp) {
            const update = await userModel.findOneAndUpdate(
                { email: email },
                { $set: { password: password } },
                { new: true }
            )

            await nodemailer.createTestAccount();

            const transporter = await nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'shemar.reinger@ethereal.email',
                    pass: 'eMQ5wwZDvvkDAuZGNh'
                }
            });

            let info = await transporter.sendMail({
                from: '"Rahul 👻" <Rahul@gmail.com>', // sender address
                to: `${email}`, // list of receivers
                subject: "Password change", // Subject line
                text: `Your password is changed.` // plain text body
            });

            console.log("Message sent: %s", info.messageId);

            return res.send({ data: update })

        } else {
            return res.send("invalid OTP.")
        }

    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}

module.exports = { createUser, resendOTP, setPassword }
