const { Employee, Leave } = require("../models/index");
const { compare } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

class EmployeeController {
  static async register(req, res, next) {
    try {
      const { nama, email, password, noTlp, address, role } = req.body;
      const employee = await Employee.create({
        nama,
        email,
        password,
        noTlp,
        address,
        role,
      });
      res.status(201).json({
        status: "success register",
        data: employee,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw {
          name: "InvalidLogin",
          message: "Email and password are required",
        };
      }

      const employee = await Employee.findOne({ where: { email } });

      if (!employee) {
        throw { name: "InvalidLogin", message: "Invalid email or password" };
      }

      const isPasswordValid = compare(password, employee.password);
      if (!isPasswordValid) {
        throw { name: "InvalidLogin", message: "Invalid email or password" };
      }

      const payload = {
        id: employee.id,
        email: employee.email,
        role: employee.role,
      };

      const access_token = generateToken(payload);

      console.log("Generated Token:", access_token);

      res.status(200).json({
        status: "success login",
        access_token,
        payload,
      });
    } catch (error) {
      console.error("Login Error:", error.message);
      next(error);
    }
  }

  static async findAllByDepartement(req, res, next) {
    try {
      const { role } = req.loginInfo; // Mengambil role dari loginInfo
      console.log("Role from loginInfo:", role);

      if (!role) {
        throw { name: "Unauthorized", message: "Role is required" };
      }

      const employees = await Employee.findAll({
        where: { role },
        attributes: ["nama", "email", "noTlp", "address", "role"], // Sesuaikan atribut yang ingin ditampilkan
      });

      console.log("Employees Found:", employees);

      res.status(200).json({
        status: "success",
        data: employees,
      });
    } catch (error) {
      console.error("Find Employees Error:", error.message);
      next(error);
    }
  }

  static async editLeave(req, res, next) {}
}

module.exports = EmployeeController;
