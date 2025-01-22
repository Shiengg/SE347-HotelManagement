const { default: mongoose } = require("mongoose");
const Booking = require("../models/Booking");
const Invoice = require("../models/Invoice");
const User = require("../models/User");

exports.getInvoices = async (req, res) => {
  try {
    // Extract page and limit from query parameters, with defaults
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 records per page
    const dateSort = req.query.dateSort || "desc"; // Default to descending sort
    const paymentMethod = req.query.paymentMethod; // Optional filter
    const paymentStatus = req.query.paymentStatus; // Optional filter
    const totalAmountSort = req.query.totalAmountSort; // Optional sort by totalAmount

    // Calculate the starting index
    const startIndex = (page - 1) * limit;

    // Create the base query object for filtering
    const query = {};
    if (paymentMethod && paymentMethod !== "all")
      query["paymentMethod"] = paymentMethod; // Filter by paymentMethod
    if ((paymentStatus !== undefined, paymentStatus !== "all"))
      query["paymentStatus"] = paymentStatus; // Filter by paymentStatus

    // Build sorting object
    const sort = {
      createdAt: dateSort === "asc" ? 1 : -1, // Default sort by createdAt
    };
    if (totalAmountSort && totalAmountSort !== "all")
      sort["totalAmount"] = totalAmountSort === "asc" ? 1 : -1; // Sort by totalAmount
    // Get the total count of invoices
    const totalCount = await Invoice.countDocuments(query);

    // Fetch the invoices with pagination
    const invoices = await Invoice.find()
      .populate({
        path: "bookingID",
        populate: [
          { path: "customerID" }, // Populate customerID
          { path: "receptionistID" }, // Populate receptionistID
          { path: "services.serviceID" }, // Populate serviceID inside services array
        ],
      })
      .skip(startIndex) // Skip records for previous pages
      .limit(limit) // Limit the number of records for this page
      .sort(sort); // Optional: Sort by creation date (newest first)

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

exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params; // Extract the invoice ID from the URL parameter
    const userId = req.query.userId; // Optional filter for userId

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // Respond with an empty JSON object if the ID is invalid
      return res.status(200).json({});
    }

    // Find the user by ID to check their role
    const user = await User.findById(userId).populate("role_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has the 'admin' or 'receptionist' role or if it's a 'customer'
    let query = {};
    if (
      user.role_id.role_name === "admin" ||
      user.role_id.role_name === "receptionist"
    ) {
      // If the user is an admin or receptionist, they can access any invoice
      query._id = id;
    } else if (user.role_id.role_name === "customer") {
      // If the user is a customer, they can only access their own invoice
      const bookings = await Booking.find({
        customerID: user._id, // Ensure the invoice belongs to the logged-in customer
      }).select("_id");

      if (!bookings) {
        return res.status(200).json({});
      }

      const customerInvoice = await Invoice.findOne({
        _id: id,
        bookingID: { $in: bookings.map((bk) => bk._id) },
      }).populate({
        path: "bookingID",
        match: { customerID: user._id }, // Ensure the booking matches the user
        populate: [
          { path: "customerID" }, // Populate customerID
          { path: "receptionistID" }, // Populate receptionistID
          { path: "services.serviceID" }, // Populate serviceID inside services array
        ],
      });
      res.status(200).json(customerInvoice);
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    // Find the invoice by ID and populate the relevant data
    const invoice = await Invoice.findById(id).populate({
      path: "bookingID",
      populate: [
        { path: "customerID" }, // Populate customerID
        { path: "receptionistID" }, // Populate receptionistID
        { path: "services.serviceID" }, // Populate serviceID inside services array
      ],
    });

    // Return the invoice with status 200
    res.status(200).json(invoice);
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

exports.getCustomerInvoices = async (req, res) => {
  try {
    const customerID = req.params.id;
    // Extract page and limit from query parameters, with defaults
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 records per page
    const dateSort = req.query.dateSort || "desc"; // Default to descending sort
    const paymentMethod = req.query.paymentMethod; // Optional filter
    const paymentStatus = req.query.paymentStatus; // Optional filter
    const totalAmountSort = req.query.totalAmountSort; // Optional sort by totalAmount

    // Calculate the starting index
    const startIndex = (page - 1) * limit;

    // Create the base query object for filtering
    const query = {};
    if (paymentMethod && paymentMethod !== "all")
      query["paymentMethod"] = paymentMethod; // Filter by paymentMethod
    if ((paymentStatus !== undefined, paymentStatus !== "all"))
      query["paymentStatus"] = paymentStatus; // Filter by paymentStatus

    // Build sorting object
    const sort = {
      createdAt: dateSort === "asc" ? 1 : -1, // Default sort by createdAt
    };
    if (totalAmountSort && totalAmountSort !== "all")
      sort["totalAmount"] = totalAmountSort === "asc" ? 1 : -1; // Sort by totalAmount

    // 1. Get all bookings for the customer
    const bookings = await Booking.find({ customerID }).select("_id"); // Get booking IDs

    // 2. If there are no bookings, return empty response
    if (bookings.length === 0) {
      return res.json({
        data: [],
        currentPage: page,
        totalPages: 0,
        totalInvoices: 0,
      });
    }

    // 3. Get the total count of invoices that match the query and belong to the bookings
    const totalCount = await Invoice.countDocuments({
      bookingID: { $in: bookings.map((bk) => bk._id) },
      ...query, // Apply any additional filters (paymentMethod, paymentStatus)
    });

    // 4. Fetch the invoices for the customer with pagination and sorting
    const invoices = await Invoice.find({
      bookingID: { $in: bookings.map((bk) => bk._id) },
      ...query, // Apply any additional filters
    })
      .populate({
        path: "bookingID",
        match: { customerID: customerID },
        populate: [
          { path: "customerID" }, // Populate customerID
          { path: "receptionistID" }, // Populate receptionistID
          { path: "services.serviceID" }, // Populate serviceID inside services array
        ],
      })
      .skip(startIndex)
      .limit(limit)
      .sort(sort); // Optional: Sort by creation date (newest first);

    // Send response with pagination metadata
    res.json({
      data: invoices,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalInvoices: totalCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params; // Extract the invoice ID from the URL parameter

    // Attempt to find and delete the invoice by its ID
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      // If no invoice is found to delete, return a 404 error
      return res.status(404).json({ message: "Invoice not found" });
    }

    // If the invoice is deleted, return a success message
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    // Handle unexpected errors, return 500 error
    res.status(500).json({ message: error.message });
  }
};
