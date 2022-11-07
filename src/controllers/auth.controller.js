const bycrypt = require("bcrypt");
const generateToken = require("../utils/genarateToken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { prismaError } = require("../errors/databaseerrors");
const nodemailer = require("nodemailer");
require("dotenv").config();


const testAccount = () => {
  return nodemailer.createTestAccount();
};

const singUp = async (req, res) => {
  try {
    const { username, email, password, dni, phone } = req.body;

    const hashedPassword = await bycrypt.hash(password, 12);

    const newUser = {
      username: username,
      email: email,
      password: hashedPassword,
      isAdmin: false,
      dni: dni,
      phone: phone,
    };

    const userDB = await prisma.user.create({
      data: newUser,
    });
    
    await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_VERIFICATION,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: "Blockbuster <no-reply@blockbuster.com>",
      to: email,
      subject: "Verify your account",
      text: `Verify your account clicking on the link below \n http://localhost:8080/api/auth/verify/${userDB.id}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
  
        return res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .json({ message: "Email of verification is send " });
      }
    });

  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.isValidate) {
      return res.status(401).json({ error: "User not validate" });
    }

    const isMatch = await bycrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      maxAge: new Date(Date.now() + 60 * 60 * 24 * 30),
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    res.status(200).json({ token });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const verify = async (req, res) => {
  console.log(req.params.id);
  try {
    const { id } = req.params;

    await prisma.user.updateMany({
      where: {
        id: parseInt(id), 
      },
      data: {
        isValidate: true,
      },
    });

    res.status(200).json({ message: "User validate" });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const updateToAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if(!req.isAdmin)
      return res.status(401).json({error: "Unauthorized"})
    await prisma.user.updateMany({
      where: {
        id: parseInt(id),
      },
      data: {
        isAdmin: true,
      },
    });
    res.status(200).json({ message: "User is admin" });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};


const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
  res.end();
};

module.exports = {
  singUp,
  login,
  logout,
  verify,
  updateToAdmin
};
