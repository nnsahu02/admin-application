const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
    let testAccount = await nodemailer.createTestAccount();

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
        to: "jyoti@gmail.com, jyoti@gmail.com", // list of receivers
        subject: "Hello Jyoti", // Subject line
        text: "Hello Bissoyi.", // plain text body
        html: "<b>Bissoyi Hello</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);

    res.json(info)
}

module.exports = sendMail