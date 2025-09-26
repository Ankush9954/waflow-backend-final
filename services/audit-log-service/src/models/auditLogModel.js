import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
    role: { type: String, enum: ['manager', 'agent', 'customer'], required: true },
    actionType: { type: String, required: true }, // e.g., Login, Create, Edit
    entityType: { type: String, required: true }, // e.g., Application, Customer
    entityId: { type: String, required: true },
    oldValue: { type: mongoose.Schema.Types.Mixed, default: null },
    newValue: { type: mongoose.Schema.Types.Mixed, default: null },
    timestamp: { type: Date, default: () => new Date(), required: true },
    ipAddress: { type: String, default: 'N/A' },
    notes: { type: String, default: 'N/A' },
  },
  { versionKey: false }
);

export default mongoose.model('AuditLog', auditLogSchema);
