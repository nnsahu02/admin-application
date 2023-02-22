const express = require('express')
const router = express.Router()

const sendMail = require('../controller/userController')

const { createUser, resendOTP, setPassword } = require('../controller/adminController')

router.get("/", (req, res) => {
    res.send("I am running.")
})

router.get('/mail', sendMail)

router.post('/createUser', createUser)

router.post('/resendOTP', resendOTP)

router.post('/setPassword', setPassword)


module.exports = router