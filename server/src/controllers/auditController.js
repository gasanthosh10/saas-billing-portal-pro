import { AuditLog } from '../models/AuditLog.js';

export const getAuditLogs = async (_req, res, next) => {
  try {
    const logs = await AuditLog.find().populate('actor', 'name role avatarColor').sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

