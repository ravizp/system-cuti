const errorHandler = (err, req, res, next) => {
  let status = 500;
  let message = "Internal Server Error";

  if (err.name === "SequelizeValidationError") {
    status = 400;
    message = err.errors[0]?.message || "Validation error";
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    status = 400;
    message = "Email must be unique";
  }

  if (err.name === "InvalidLogin") {
    status = 401;
    message = "Invalid email or password";
  }

  if (err.name === "Unauthorized" || err.name === "JsonWebTokenError") {
    status = 401;
    message = err.message || "Invalid token";
  }

  console.error("Error Handler Log:", { name: err.name, message: err.message });

  res.status(status).json({ message });
};

module.exports = errorHandler;
