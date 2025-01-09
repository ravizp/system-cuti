const jwt = require("jsonwebtoken");

const secret = "ravizp"; // Gunakan secret yang sama di seluruh aplikasi

const generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: "1h" }); // Tambahkan expiry untuk keamanan
};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = { generateToken, verifyToken };
