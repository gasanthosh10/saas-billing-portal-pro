import { HttpError } from '../utils/httpError.js';

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(new HttpError(result.error.issues.map((issue) => issue.message).join(', '), 400));
  }
  req.body = result.data;
  next();
};

