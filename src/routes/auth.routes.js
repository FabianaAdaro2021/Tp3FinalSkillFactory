const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  isEmail,
  isSecurePassword,
  repasswordMatch,
} = require("../middleware/auth.middleware");
const { requireToken } = require("../middleware/requiretoken");
function helloWorld(req, res) {
    
  res.send('Hello World! ')
}
router.get("/", helloWorld);  
router.post(
  "/signup",
  isEmail,
  isSecurePassword,
  repasswordMatch,
  authController.singUp
);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/verify/:id", authController.verify);
router.put("/updateToAdmin/:id", requireToken ,authController.updateToAdmin);

module.exports = router;
