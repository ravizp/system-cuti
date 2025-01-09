const { Op } = require("sequelize");
const { Employee, Leave } = require("../models/index");

class LeaveController {
  static async createLeave(req, res, next) {
    try {
      const { EmployeeId } = req.loginInfo;
      const { dateFrom, dateTo, description } = req.body;

      // Validasi input
      if (!dateFrom || !dateTo || !description) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);

      // Validasi tanggal
      if (toDate <= fromDate) {
        return res.status(400).json({
          error: "`dateTo` must be later than `dateFrom`",
        });
      }

      // Hitung jumlah hari (day)
      const day = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

      // Buat leave baru
      const leave = await Leave.create({
        EmployeeId,
        dateFrom: fromDate,
        dateTo: toDate,
        day,
        description,
        status: "draft",
        message: "-",
        recordBy: "[]",
      });

      res.status(201).json({
        status: "success",
        message: "Leave created successfully",
        data: leave,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async findAllLeavesManagerHRD(req, res, next) {
    try {
      const { role } = req.loginInfo;

      if (role !== "Manager HRD") {
        return res.status(403).json({
          status: "error",
          message: "You do not have permission to access this resource",
        });
      }

      const leaves = await Leave.findAll({
        where: { status: "Approve Manager" },
        include: {
          model: Employee,
          attributes: ["id", "nama", "role"],
        },
      });

      // Jika tidak ada data leaves
      if (leaves.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No leaves found with status 'Approve Manager'",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Leaves with status 'Approve Manager' retrieved successfully",
        data: leaves,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async findLeavesByPkEmployee(req, res, next) {
    try {
      const { EmployeeId, role } = req.loginInfo;

      if (role === "Manager HRD") {
        return res.status(403).json({
          status: "error",
          message: "Managers cannot access this resource",
        });
      }

      const leaves = await Leave.findAll({
        where: { EmployeeId },
        include: {
          model: Employee,
          attributes: ["id", "nama", "role"],
        },
      });

      if (leaves.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No leaves found for this employee",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Leaves retrieved successfully",
        data: leaves,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async findOneWithRole(req, res, next) {
    try {
      const { EmployeeId, role } = req.loginInfo;

      const roleGroup = role.split(" ")[1];
      if (!roleGroup) {
        return res.status(400).json({
          status: "error",
          message: "Invalid role format",
        });
      }

      let statusFilter;
      if (role.startsWith("SPV")) {
        statusFilter = "draft";
      } else if (role.startsWith("Manager")) {
        statusFilter = "Approve SPV";
      } else {
        return res.status(403).json({
          status: "error",
          message: "You do not have permission to access this resource",
        });
      }

      const leaves = await Leave.findAll({
        include: {
          model: Employee,
          where: {
            role: {
              [Op.like]: `%${roleGroup}%`,
            },
          },
          attributes: ["id", "nama", "role"],
        },
        where: {
          status: statusFilter,
        },
      });

      if (leaves.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No leaves found for your role and status",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Leaves retrieved successfully",
        data: leaves,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async updateStatusLeave(req, res, next) {
    try {
      const { id } = req.params;
      const { EmployeeId, role } = req.loginInfo;
      const { status } = req.body;

      // Validasi ID leave
      if (!id) {
        return res.status(400).json({ error: "Leave ID is required" });
      }

      // Cari leave berdasarkan ID
      const leave = await Leave.findByPk(id);

      if (!leave) {
        return res.status(404).json({ error: "Leave not found" });
      }

      // Tentukan status baru berdasarkan role
      let updatedStatus;
      if (role.startsWith("SPV")) {
        updatedStatus = "Approve SPV";
      } else if (role.startsWith("Manager")) {
        updatedStatus = "Approve Manager";
      } else if (role.startsWith("Manager HRD")) {
        updatedStatus = "Approve Manager HRD";
      } else {
        return res.status(403).json({
          status: "error",
          message: "You do not have permission to update this leave",
        });
      }

      const currentDate = new Date();
      let recordBy = leave.recordBy ? JSON.parse(leave.recordBy) : [];
      recordBy.push({
        EmployeeId,
        role,
        updatedStatus,
        date: currentDate.toISOString(),
      });

      await leave.update({
        status: updatedStatus,
        recordBy: JSON.stringify(recordBy),
      });

      res.status(200).json({
        status: "success",
        message: "Leave status updated successfully",
        data: {
          id: leave.id,
          status: leave.status,
          recordBy: recordBy,
        },
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async editLeave(req, res, next) {
    try {
      const { id } = req.params;
      const { EmployeeId } = req.loginInfo;
      const { dateFrom, dateTo, description } = req.body;

      if (!dateFrom || !dateTo || !description) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);

      if (toDate <= fromDate) {
        return res
          .status(400)
          .json({ error: "`dateTo` must be later than `dateFrom`" });
      }

      const leave = await Leave.findOne({
        where: {
          id,
          EmployeeId,
        },
      });

      if (!leave) {
        return res
          .status(404)
          .json({ error: "Leave not found or unauthorized" });
      }

      const day = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

      await leave.update({
        dateFrom: fromDate,
        dateTo: toDate,
        day,
        description,
      });

      res.status(200).json({
        status: "success",
        message: "Leave updated successfully",
        data: leave,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async deleteLeave(req, res, next) {
    try {
      const { id } = req.params;
      const { EmployeeId } = req.loginInfo;

      const leave = await Leave.findOne({
        where: {
          id,
          EmployeeId,
        },
      });

      if (!leave) {
        return res
          .status(404)
          .json({ error: "Leave not found or unauthorized" });
      }

      await leave.destroy();

      res.status(200).json({
        status: "success",
        message: "Leave deleted successfully",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

module.exports = LeaveController;
