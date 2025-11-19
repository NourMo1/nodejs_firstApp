const jwt =  require('jsonwebtoken');
const { FAIL, ERROR } = require('../utils/httpStatusText');
const errorHandler = require('../utils/errorHandler');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) {
    const error = errorHandler.create("Access Denied: No Token Provided!", 401, FAIL);
    return next(error);
  }
  const token = authHeader.split(' ')[1]; // Bearer TOKEN
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = currentUser; // Attach user info to request object
    next();
  } catch (e) {
    const error = errorHandler.create("Invalid Token", 401, ERROR);
    return next(error);
  }
}

module.exports = verifyToken;