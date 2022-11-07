const isEmail = async (req, res, next) => {
  const { email } = req.body;
  if (email.match(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/)) {
    next();
  } else {
    res.status(400).json({ errorMessage: "Invalid email" });
  }
};

const isSecurePassword = async (req, res, next) => {
  const { password } = req.body;
  //special characters
  if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
    next();
  } else {
    res.status(400).json({ errorMessage: "Invalid password" });
  }
};

const repasswordMatch = async (req, res, next) => {
  const { password, repassword } = req.body;
  if (password === repassword) {
    next();
  } else {
    res.status(400).json({ errorMessage: "Passwords do not match" });
  }
};

module.exports = {
  isEmail,
  isSecurePassword,
  repasswordMatch,
};
