import Company from "../models/companyModel.js";
import { v4 as uuidv4 } from "uuid";

export const createCompany = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Company name is required" });

    // generate tenantId
    const tenantId = uuidv4();
    const company = new Company({ name, tenantId });
    await company.save();

    return res.status(201).json({ message: "Company created", company });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Company name or tenantId already exists" });
    }
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
