import Manager from "../models/managerModel.js";
import Auth from "../models/authModel.js"; // copied from auth-service
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export const createManager = async (req, res) => {
  try {
    const {
      tenantId,
      fullName,
      email,
      phoneNumber,
      company,
      createdBy,
      tempPassword,
    } = req.body;

    // Auto-generate Manager ID
    const managerId = `MGR-${uuidv4().slice(0, 8)}`;

    // Create Manager in Manager collection
    const manager = new Manager({
      managerId,
      tenantId,
      fullName,
      email,
      phoneNumber,
      company,
      createdBy,
    });
    await manager.save();

    // Create entry in Auth collection (local copy)
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const authEntry = new Auth({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "manager",
      tenantId,
      isActive: true,
      isFirstLogin: true,
      tempPassword, // store temp password for first login
    });
    await authEntry.save();

    res.status(201).json({
      message: "Manager created successfully and auth entry generated.",
      manager,
      authId: authEntry._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Managers (by tenant)
export const getManagers = async (req, res) => {
  try {
    const { tenantId } = req.query; // pass ?tenantId=xxx in request
    const filter = tenantId ? { tenantId } : {};
    const managers = await Manager.find(filter);
    res.json(managers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Manager by ID
export const getManagerById = async (req, res) => {
  try {
    const manager = await Manager.findOne({ managerId: req.params.id });
    if (!manager) return res.status(404).json({ message: "Manager not found" });
    res.json(manager);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Manager
export const updateManager = async (req, res) => {
  try {
    const { updatedBy } = req.body;

    const manager = await Manager.findOneAndUpdate(
      { managerId: req.params.id },
      { ...req.body, updatedBy, updatedAt: new Date() },
      { new: true }
    );

    if (!manager) return res.status(404).json({ message: "Manager not found" });
    res.json(manager);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Manager
export const deleteManager = async (req, res) => {
  try {
    const manager = await Manager.findOneAndDelete({
      managerId: req.params.id,
    });
    if (!manager) return res.status(404).json({ message: "Manager not found" });
    res.json({ message: "Manager deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
