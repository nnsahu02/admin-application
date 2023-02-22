const crypto = require('crypto');
const nodemailer = require('nodemailer');
const redis = require('redis');
const client = redis.createClient();

// Create a unique one-time password for the user
const generateOTP = () => {
    return crypto.randomBytes(4).toString('hex');
};

// Store the OTP along with the user's email in Redis
const storeOTP = (email, otp) => {
  client.set(email, otp, 'EX', 3600); // Expire the key after 1 hour
};

// Send an email to the user with a link containing the OTP
const sendEmail = (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'shemar.reinger@ethereal.email',
            pass: 'eMQ5wwZDvvkDAuZGNh'
        }
    });

    const link = `https://example.com/reset-password?email=${email}&otp=${otp}`;

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Reset your password',
        text: ` "Click this link to reset your password:" ${link}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};



// Handle the password reset request
app.get('/reset-password', (req, res) => {
    const email = req.query.email;
    const otp = req.query.otp;

    // Verify that the OTP matches the one stored in Redis
    client.get(email, (error, storedOTP) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Internal server error');
        }

        if (otp === storedOTP) {
            // Prompt the user to reset their password
            res.send('Please enter your new password');
        } else {
            res.status(400).send('Invalid OTP');
        }
    });
});



// Handle the password reset submission
app.post('/reset-password', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Hash and store the new password securely
    bcrypt.hash(password, 10, (error, hash) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Internal server error');
        }
    })
})