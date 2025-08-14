// controllers/employeeController.js
const Employee = require("../models/Employee");

// Create
exports.createEmployee = async (req, res, next) => {
  try {
    const emp = await Employee.create(req.body);
    return res.status(201).json({ success: true, data: emp });
  } catch (err) {
    // Handle duplicate email nicely
    if (err?.code === 11000) {
      err.statusCode = 409;
      err.message = "Email already exists";
    }
    next(err);
  }
};

// Read (list) with filters/pagination/sort
exports.getEmployees = async (req, res, next) => {
  try {
    const {
      q,                 // full-text search on name/position/department
      department,
      minSalary,
      maxSalary,
      isActive,
      page = 1,
      limit = 10,
      sort = "-createdAt" // default newest first
    } = req.query;

    const filter = {};

    if (q) {
      filter.$text = { $search: q };
    }
    if (department) {
      filter.department = department;
    }
    if (typeof isActive !== "undefined") {
      filter.isActive = isActive === "true";
    }
    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = Number(minSalary);
      if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Employee.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Employee.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      total,
      data: items
    });
  } catch (err) {
    next(err);
  }
};

// Read (single)
exports.getEmployeeById = async (req, res, next) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });
    return res.json({ success: true, data: emp });
  } catch (err) {
    next(err);
  }
};

// Update (PUT: full update)
exports.updateEmployee = async (req, res, next) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });
    return res.json({ success: true, data: emp });
  } catch (err) {
    // Handle email uniqueness on update
    if (err?.code === 11000) {
      err.statusCode = 409;
      err.message = "Email already exists";
    }
    next(err);
  }
};

// Partial Update (PATCH)
exports.patchEmployee = async (req, res, next) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, { $set: req.body }, {
      new: true,
      runValidators: true
    });
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });
    return res.json({ success: true, data: emp });
  } catch (err) {
    if (err?.code === 11000) {
      err.statusCode = 409;
      err.message = "Email already exists";
    }
    next(err);
  }
};

// Delete
exports.deleteEmployee = async (req, res, next) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });
    return res.json({ success: true, message: "Employee deleted" });
  } catch (err) {
    next(err);
  }
};
