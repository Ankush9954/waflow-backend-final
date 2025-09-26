import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the service folder
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const logAction = async ({
  tenantId,
  userId,
  role,
  actionType,
  entityType,
  entityId,
  oldValue = null,
  newValue = null,
  ipAddress = 'N/A',
  notes = 'N/A',
}) => {
  try {
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5001}`;
    await axios.post(`${baseUrl}/api/audit/log`, {
      tenantId,
      userId,
      role,
      actionType,
      entityType,
      entityId,
      oldValue,
      newValue,
      ipAddress,
      notes,
    });
  } catch (err) {
    console.error('🔴 Failed to log audit:', err.message);
  }
};
