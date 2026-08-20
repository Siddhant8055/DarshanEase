import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

/**
 * Middleware to protect routes from unauthorized users.
 * Verifies JWT token and attaches user object to req.user.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Split the header to get token: "Bearer TOKEN_STRING"
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and attach to request object, excluding password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        return next(new Error('User associated with this token no longer exists'));
      }

      return next(); // Proceed to the next middleware or controller
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed or expired'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};

/**
 * Middleware to restrict access to ADMIN role only.
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403);
    return next(new Error('Access denied, administrator role required'));
  }
};

/**
 * Middleware to restrict access to ADMIN or ORGANIZER roles.
 */
export const adminOrOrganizer = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'ORGANIZER')) {
    next();
  } else {
    res.status(403);
    return next(new Error('Access denied, administrator or organizer role required'));
  }
};
