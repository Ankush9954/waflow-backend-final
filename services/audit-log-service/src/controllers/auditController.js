import AuditLog from '../models/auditLogModel.js';
import mongoose from 'mongoose';

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;

// POST /audit/log
export const createLog = async (req, res) => {
  try {
    const data = { ...req.body };

    if (!data.tenantId || !isValidObjectId(data.tenantId))
      return res.status(400).json({ success: false, message: 'Invalid tenantId' });

    if (!data.userId || !isValidObjectId(data.userId))
      return res.status(400).json({ success: false, message: 'Invalid userId' });

    data.tenantId = new mongoose.Types.ObjectId(data.tenantId);
    data.userId = new mongoose.Types.ObjectId(data.userId);
    if (!data.oldValue) data.oldValue = null;
    if (!data.newValue) data.newValue = null;
    if (!data.ipAddress) data.ipAddress = 'N/A';
    if (!data.notes) data.notes = 'N/A';

    const log = await AuditLog.create(data);
    res.status(201).json({ success: true, log });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Log creation failed', error: err.message });
  }
};

// GET /audit/logs
export const getLogs = async (req, res) => {
  try {
    const {
      userId,
      entityType,
      actionType,
      dateFrom,
      dateTo,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    if (!req.user?.tenantId) return res.status(400).json({ message: 'Missing tenantId' });

    const query = { tenantId: req.user.tenantId };

    if (userId) query.userId = userId;
    if (entityType) query.entityType = entityType;
    if (actionType) query.actionType = actionType;
    if (dateFrom || dateTo) query.timestamp = {};
    if (dateFrom) query.timestamp.$gte = new Date(dateFrom);
    if (dateTo) query.timestamp.$lte = new Date(dateTo);
    if (search)
      query.$or = [
        { entityId: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } },
      ];

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await AuditLog.countDocuments(query);

    res.status(200).json({ success: true, total, page: Number(page), limit: Number(limit), logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
