const errorHandler = require("../utils/errorHandler");

const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(errorHandler.create("You are not allowed to access this route", 403));
    }
    next();
  };
}

module.exports = allowedTo;