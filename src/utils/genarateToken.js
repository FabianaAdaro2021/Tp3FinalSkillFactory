const jsonwebtoken = require("jsonwebtoken");

const generateToken = (user) => {
  try {
    const token = jsonwebtoken.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 60 * 60 * 24 * 30,
      }
    );
    return token;
  } catch (err) {
    console.log(err);
  }
};

module.exports = generateToken;
