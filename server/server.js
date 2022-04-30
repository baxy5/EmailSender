const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config();

// Transporter setup with OAuth2
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    pass: process.env.WORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`Server is ready to take message: ${success}`);
});

// Store and sending data
let data;

app.post("/email", (req, res) => {
  res.send(req.body);
  data = req.body;
  console.log(req.body);

  let mailOptions = {
    from: data.userEmail,
    to: process.env.EMAIL,
    subject: data.userName,
    text: data.userPhone,
  };

  // Sending mail
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
      res.json({ status: "Email sent" });
    }
  });
});

app.get("/email", (req, res) => {
  res.send(data);
});

app.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
});
