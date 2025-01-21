const Invoice = require("../models/Invoice");

exports.getInvoice = async (req, res) => {
  try {
    // Extract page and limit from query parameters, with defaults
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 records per page

    // Calculate the starting index
    const startIndex = (page - 1) * limit;

    // Get the total count of invoices
    const totalCount = await Invoice.countDocuments();

    // Fetch the invoices with pagination
    const invoices = await Invoice.find()
      .skip(startIndex) // Skip records for previous pages
      .limit(limit) // Limit the number of records for this page
      .sort({ createdAt: -1 }); // Optional: Sort by creation date (newest first)

    // Send response with pagination metadata
    res.json({
      data: invoices,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalInvoices: totalCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const room = new Room(req.body);
    const newRoom = await room.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.cancelInvoice = async (req, res) => {};
