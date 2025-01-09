const routes = require("express").Router();
const EmployeeController = require("../controllers/employeeController");
const LeaveController = require("../controllers/leaveController");
const errorHandler = require("../middlewares/errorHandler");
const authentication = require("../middlewares/authentication");

routes.post("/register", EmployeeController.register);
routes.post("/login", EmployeeController.login);

routes.use(authentication);
routes.get("/employees", EmployeeController.findAllByDepartement);

routes.post("/leaves", LeaveController.createLeave);
routes.get("/leaves-manager-hrd", LeaveController.findAllLeavesManagerHRD);
routes.get("/leaves-employee-login", LeaveController.findLeavesByPkEmployee);
routes.get("/leaves-role-status", LeaveController.findOneWithRole);
routes.patch("/leaves/:id", LeaveController.updateStatusLeave);
routes.put("/leaves/:id", LeaveController.editLeave);
routes.delete("/leaves/:id", LeaveController.deleteLeave);

routes.use(errorHandler);
module.exports = routes;
