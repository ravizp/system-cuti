const { verifyToken } = require("../helpers/jwt");
const { Employee } = require("../models/index");

const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // console.log(authorization);

    // Validasi header Authorization
    if (!authorization || !authorization.startsWith("Bearer ")) {
      // console.error("Authorization Header Missing or Invalid:", authorization);
      throw { name: "Unauthorized", message: "Token is missing or invalid" };
    }

    const token = authorization.split(" ")[1];

    let payload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      console.error("Token Verification Error:", error.message);
      throw { name: "Unauthorized", message: "Invalid token" };
    }

    const employee = await Employee.findByPk(payload.id);
    if (!employee) {
      console.error("Employee Not Found for ID:", payload.id);
      throw { name: "Unauthorized", message: "User not found" };
    }

    req.loginInfo = {
      EmployeeId: employee.id,
      email: employee.email,
      role: employee.role,
    };

    console.log("Authenticated User:", req.loginInfo);

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
