import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

export const protect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new HttpError('Authentication token missing', 401);

    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('company', 'name domain status').select('-password');
    if (!user) throw new HttpError('User no longer exists', 401);

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new HttpError('Invalid or expired token', 401));
  }
};

export const allowRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new HttpError('You do not have permission for this action', 403));
  }
  next();
};

