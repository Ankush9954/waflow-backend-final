import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema({
  managerId: { type: String, unique: true }, // e.g. MGR-0001
  tenantId: { type: String, required: true }, // not unique
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  company: { type: String }, // lowercase for consistency
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  role: { type: String, default: 'manager' },

  // Audit fields
  createdBy: { type: String },
  updatedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Manager', managerSchema);
