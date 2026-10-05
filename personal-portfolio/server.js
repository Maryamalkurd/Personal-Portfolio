require("dotenv").config();
const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const projectsRouter = require("./routes/projects");
const skillsRouter = require("./routes/skills");
const uploadRouter = require("./routes/upload");
const authRouter = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.use("/api", projectsRouter);
app.use("/api", skillsRouter);
app.use("/api", uploadRouter);
app.use("/api", authRouter);
app.use("/uploads", express.static("uploads"));
app.listen(5000, () => console.log("Server Running"));

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "kurd123987@gmail.com",
    pass: "enqp gvfs ofzk dagg"
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const name = req.body.firstName + req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const mail = {
    from: name,
    to: "kurd123987@gmail.com",
    subject: "Contact Form Submission - Portfolio",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});