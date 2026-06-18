import { User } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';
import { generateToken } from '../utils/generateToken.js';

const payload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  company: user.company,
  avatarColor: user.avatarColor
});

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate('company', 'name domain status');
    if (!user || !(await user.matchPassword(req.body.password))) {
      throw new HttpError('Invalid email or password', 401);
    }
    res.json({ user: payload(user), token: generateToken(user._id) });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) throw new HttpError('Email is already registered', 409);
    const user = await User.create(req.body);
    res.status(201).json({ user: payload(user), token: generateToken(user._id) });
  } catch (error) {
    next(error);
  }
};

export const me = (req, res) => {
  res.json({ user: payload(req.user) });
};

