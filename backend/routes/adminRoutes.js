const express = require("express");
const router = express.Router();
const User = require("../model/user");
const Book = require("../model/book");
const Order = require("../model/order");
const Complaint = require("../model/complaint");

const { jwtAuthMiddleWare, generateToken } = require("../jwt");

// Import required modules for file upload
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dpbiv3sge",
  api_key: "565427365646111",
  api_secret: "Q_HX9XMH80zvwc-I5e3iZMGI2oQ",
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads";
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const random = uuidv4();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.send("Admin Routes working ");
});

// Add Book
router.post(
  "/addBook",
  jwtAuthMiddleWare,
  upload.single("image"),
  async (req, res) => {
    // Debug: Log the decoded user data
    console.log("Decoded user from JWT:", req.user);
    console.log("User role:", req.user.role);
    console.log("Role type:", typeof req.user.role);

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied , only Admin can add Books",
        userRole: req.user.role,
        userInfo: req.user,
      });
    }

    try {
      const bookData = req.body;
      let imageUrl = "";

      console.log("Book data received:", bookData);
      console.log("File received:", req.file);

      // If a file was uploaded, upload it to Cloudinary
      if (req.file) {
        try {
          console.log("Uploading book image to Cloudinary:", req.file.path);
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "book_management_books", // Organize uploads in folders
          });
          imageUrl = result.secure_url;
          console.log("Cloudinary upload successful:", imageUrl);

          // Delete the local file after uploading to Cloudinary
          fs.unlinkSync(req.file.path);
        } catch (uploadError) {
          console.error(
            "Error uploading book image to Cloudinary:",
            uploadError
          );
          // Delete the local file even if Cloudinary upload fails
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(500).json({
            message: "Error uploading book image",
            error: uploadError.message,
          });
        }
      }

      // Add the image URL to book data
      const completeBookData = {
        ...bookData,
        image: imageUrl || bookData.image || "", // Use uploaded image or provided URL or empty string
      };

      console.log("Complete book data:", completeBookData);
      const newBook = new Book(completeBookData);
      console.log("New book created:", newBook);

      await newBook.save();
      console.log("Book saved successfully");

      return res
        .status(201)
        .json({ message: "Book added successfully", book: newBook });
    } catch (err) {
      console.error("Error adding book:", err);
      console.error("Error details:", err.message);
      console.error("Error stack:", err.stack);

      // Clean up uploaded file if book creation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({
        message: "Internal server error",
        error: err.message,
        details: err,
      });
    }
  }
);

// Update the Book
router.post(
  "/updateBook/:id",
  jwtAuthMiddleWare,
  upload.single("image"),
  async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied, only Admin can update Books",
        userRole: req.user.role,
        userInfo: req.user,
      });
    }

    try {
      const bookId = req.params.id;
      const updateData = req.body;
      let imageUrl = updateData.image || "";

      // If a new image file is uploaded, upload to Cloudinary
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "book_management_books",
          });
          imageUrl = result.secure_url;
          // Delete local file after upload
          fs.unlinkSync(req.file.path);
        } catch (uploadError) {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(500).json({
            message: "Error uploading book image",
            error: uploadError.message,
          });
        }
      }

      // Prepare update object
      const updatedBookData = {
        ...updateData,
        image: imageUrl,
      };

      // Update the book in DB
      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        updatedBookData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.status(200).json({
        message: "Book updated successfully",
        book: updatedBook,
      });
    } catch (err) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({
        message: "Internal server error",
        error: err.message,
        details: err,
      });
    }
  }
);

// Delete The Book
router.delete("/deleteBook/:id", jwtAuthMiddleWare, async (req, res) => {
  // Debug: Log the decoded user data
  console.log("Delete request - Decoded user from JWT:", req.user);
  console.log("Delete request - User role:", req.user.role);

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied, only Admin can delete Books",
      userRole: req.user.role,
      userInfo: req.user,
    });
  }

  try {
    const bookId = req.params.id;
    console.log("Attempting to delete book with ID:", bookId);

    // Check if book exists first
    const existingBook = await Book.findById(bookId);
    console.log("Book found before deletion:", existingBook);

    if (!existingBook) {
      console.log("Book not found with ID:", bookId);
      return res.status(404).json({ message: "Book not found" });
    }

    const deletedBook = await Book.findByIdAndDelete(bookId);
    console.log("Book deleted successfully:", deletedBook);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (err) {
    console.error("Error deleting book:", err);
    console.error("Error details:", err.message);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
      details: err,
    });
  }
});

//Get All the Books
router.get("/allBooks", jwtAuthMiddleWare, async (req, res) => {
  try {
    const books = await Book.find({});
    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }
    res.status(200).json({
      message: "Books retrieved successfully",
      books: books,
    });
  } catch (err) {
    console.error("Error retrieving books:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

// Get all orders (Admin only)
router.get("/orders", jwtAuthMiddleWare, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied, only Admin can view all orders",
      userRole: req.user.role,
      userInfo: req.user,
    });
  }

  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("books.book", "title author price")
      .sort({ orderedAt: -1 }); // Sort by newest first

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders: orders,
      totalOrders: orders.length,
    });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

// Get specific order by ID (Admin only)
router.get("/orders/:id", jwtAuthMiddleWare, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied, only Admin can view order details",
      userRole: req.user.role,
      userInfo: req.user,
    });
  }

  try {
    const orderId = req.params.id;
    console.log("Admin fetching order with ID:", orderId);

    const order = await Order.findById(orderId)
      .populate("user", "name email photo role createdAt")
      .populate("books.book", "title author price category stock image");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order retrieved successfully",
      order: order,
    });
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

// Update order status (Admin only)
router.put("/orders/:id", jwtAuthMiddleWare, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied, only Admin can update order status",
      userRole: req.user.role,
      userInfo: req.user,
    });
  }

  try {
    const orderId = req.params.id;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "shipped", "delivered"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: pending, shipped, delivered",
        validStatuses: validStatuses,
      });
    }

    console.log(`Admin updating order ${orderId} status to: ${status}`);

    // Find and update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true, runValidators: true }
    )
      .populate("user", "name email")
      .populate("books.book", "title author price");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("Order status updated successfully:", updatedOrder.status);

    res.status(200).json({
      message: `Order status updated to ${status} successfully`,
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

// Get all complaints for admin
router.get("/complaints", jwtAuthMiddleWare, async (req, res) => {
  try {
    const { status, type, priority, category } = req.query;
    let filter = {};

    // Apply filters if provided
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const complaints = await Complaint.find(filter)
      .populate("user", "name email")
      .populate("respondedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching complaints",
      error: err.message,
    });
  }
});

// Get complaint statistics
router.get("/complaints/stats", jwtAuthMiddleWare, async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({
      status: "pending",
    });
    const resolvedComplaints = await Complaint.countDocuments({
      status: "resolved",
    });
    const inProgressComplaints = await Complaint.countDocuments({
      status: "in-progress",
    });

    const complaintsByType = await Complaint.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    const complaintsByCategory = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total: totalComplaints,
        pending: pendingComplaints,
        resolved: resolvedComplaints,
        inProgress: inProgressComplaints,
        byType: complaintsByType,
        byCategory: complaintsByCategory,
      },
    });
  } catch (err) {
    console.error("Error fetching complaint stats:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching complaint stats",
      error: err.message,
    });
  }
});

// Update complaint status and respond
router.put("/complaint/:id", jwtAuthMiddleWare, async (req, res) => {
  try {
    const { status, adminResponse, priority } = req.body;
    const complaintId = req.params.id;

    const updateData = {
      updatedAt: new Date(),
    };

    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;

    if (adminResponse) {
      updateData.adminResponse = adminResponse;
      updateData.respondedBy = req.user.id;
      updateData.respondedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      updateData,
      { new: true }
    )
      .populate("user", "name email")
      .populate("respondedBy", "name");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (err) {
    console.error("Error updating complaint:", err);
    res.status(500).json({
      success: false,
      message: "Error updating complaint",
      error: err.message,
    });
  }
});

// Get specific complaint for admin
router.get("/complaint/:id", jwtAuthMiddleWare, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email")
      .populate("respondedBy", "name");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (err) {
    console.error("Error fetching complaint:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching complaint",
      error: err.message,
    });
  }
});

// Delete complaint (admin only)
router.delete("/complaint/:id", jwtAuthMiddleWare, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting complaint:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting complaint",
      error: err.message,
    });
  }
});

module.exports = router;
