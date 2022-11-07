const { jwtErrors } = require("../errors/jwterrors");
const jwt = require("jsonwebtoken");
 const requireToken = (req, res, next) => {
  try {
    
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(401).send(jwtErrors["invalid token"]);
    }
    
    const { id, isAdmin } = jwt.verify(token, process.env.JWT_SECRET);

    req.id = id;
    req.isAdmin = isAdmin;

    next();
  } catch (error) {
    const { message } = error;
    const errorMessage = jwtErrors[message] || "Something went wrong";

    res.status(401).send(errorMessage);
  }
};

module.exports = {
  requireToken,
}