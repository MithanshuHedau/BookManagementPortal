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
  res.send("User Routes working ");
});

// Check if admin exists
router.get("/check-admin", async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    res.status(200).json({
      adminExists: !!existingAdmin,
      message: existingAdmin ? "Admin already exists" : "No admin found",
    });
  } catch (error) {
    console.error("Error checking admin:", error);
    res.status(500).json({
      message: "Error checking admin status",
      error: error.message,
    });
  }
});

router.post("/register", upload.single("photo"), async (req, res) => {
  try {
    const data = req.body;
    let photoUrl = "";

    // Check if user is trying to register as admin
    if (data.role === "admin") {
      // Check if an admin already exists
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        // Clean up uploaded file if admin already exists
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          message:
            "Admin already exists. Only one admin is allowed in the system.",
          error: "ADMIN_EXISTS",
        });
      }
    }

    // If a file was uploaded, upload it to Cloudinary
    if (req.file) {
      try {
        console.log("Uploading file to Cloudinary:", req.file.path);
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "book_management_users", // Optional: organize uploads in folders
        });
        photoUrl = result.secure_url;
        console.log("Cloudinary upload successful:", photoUrl);

        // Delete the local file after uploading to Cloudinary
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        // Delete the local file even if Cloudinary upload fails
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
          message: "Error uploading image",
          error: uploadError.message,
          details: uploadError,
        });
      }
    }

    // Add the photo URL to user data
    const userData = {
      ...data,
      photo: photoUrl || data.photo || "", // Use uploaded image or provided URL or empty string
    };

    const newUser = new User(userData);
    const response = await newUser.save();
    console.log("Data Save Done:", response);

    const payload = {
      id: response._id,
      role: response.role,
    };
    const token = generateToken(payload);
    console.log("Token Generated:", token);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: response._id,
        name: response.name,
        email: response.email,
        role: response.role,
        photo: response.photo,
        createdAt: response.createdAt,
      },
      token: token,
    });
  } catch (err) {
    console.error("Error occurred during registration:", err);

    // Clean up uploaded file if registration fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: "Error in registration process",
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
    });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = generateToken(payload);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
        createdAt: user.createdAt,
      },
      token: token,
    });
  } catch (err) {
    console.error("Error occurred during login:", err);
    res.status(500).json({
      message: "Error in login process",
    });
  }
});

router.get("/profile", jwtAuthMiddleWare, async (req, res) => {
  try {
    const userData = req.user; // joh jwt file , jwtAuthMiddleWare function se user.data = decoded , voh hai req.user milta hai
    const userId = userData.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
    console.log("User profile fetched successfully:", user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({
      error:
        "Error In login , Please Login After Sometime or Create The New User",
    });
  }
});

router.get("/allBooks", jwtAuthMiddleWare, async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ books });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching books", error: err.message });
  }
});

router.get("/book/:id", jwtAuthMiddleWare, async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ book });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching book", error: err.message });
  }
});

// Add item to cart
router.post("/cart", jwtAuthMiddleWare, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId, quantity = 1 } = req.body;

    // Validate book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if book already exists in cart
    const existingCartItem = user.cart.find(
      (item) => item.book.toString() === bookId
    );

    if (existingCartItem) {
      // Update quantity if book already in cart
      existingCartItem.quantity += quantity;
    } else {
      // Add new item to cart
      user.cart.push({ book: bookId, quantity });
    }

    await user.save();

    // Populate cart items with book details for response
    await user.populate("cart.book");

    res.status(200).json({
      message: "Item added to cart successfully",
      cart: user.cart,
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({
      message: "Error adding item to cart",
      error: err.message,
    });
  }
});

// Get all cart items for user
router.get("/cart", jwtAuthMiddleWare, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("cart.book");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Cart retrieved successfully",
      cart: user.cart,
      totalItems: user.cart.reduce((total, item) => total + item.quantity, 0),
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({
      message: "Error fetching cart",
      error: err.message,
    });
  }
});

// Update cart item quantity
router.put("/cart/:bookId", jwtAuthMiddleWare, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItem = user.cart.find((item) => item.book.toString() === bookId);
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cartItem.quantity = quantity;
    await user.save();

    // Populate cart items with book details for response
    await user.populate("cart.book");

    res.status(200).json({
      message: "Cart item updated successfully",
      cart: user.cart,
    });
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({
      message: "Error updating cart item",
      error: err.message,
    });
  }
});

// Delete item from cart
router.delete("/cart/:bookId", jwtAuthMiddleWare, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.book.toString() === bookId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    user.cart.splice(itemIndex, 1);
    await user.save();

    // Populate remaining cart items with book details for response
    await user.populate("cart.book");

    res.status(200).json({
      message: "Item removed from cart successfully",
      cart: user.cart,
    });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({
      message: "Error removing item from cart",
      error: err.message,
    });
  }
});

// Clear entire cart
router.delete("/cart", jwtAuthMiddleWare, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];
    await user.save();

    res.status(200).json({
      message: "Cart cleared successfully",
      cart: user.cart,
    });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({
      message: "Error clearing cart",
      error: err.message,
    });
  }
});

// Place an order from cart
router.post("/order", jwtAuthMiddleWare, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with populated cart
    const user = await User.findById(userId).populate("cart.book");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if cart is empty
    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate all books in cart and calculate total
    let totalAmount = 0;
    const orderBooks = [];

    for (const cartItem of user.cart) {
      const book = cartItem.book;

      // Check if book still exists
      if (!book) {
        return res.status(400).json({
          message: "One or more books in cart no longer exist",
        });
      }

      // Check stock availability
      if (book.stock < cartItem.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${book.title}. Available: ${book.stock}, Requested: ${cartItem.quantity}`,
        });
      }

      // Calculate total amount
      totalAmount += book.price * cartItem.quantity;

      // Prepare order book data
      orderBooks.push({
        book: book._id,
        quantity: cartItem.quantity,
      });
    }

    // Create the order
    const order = new Order({
      user: userId,
      books: orderBooks,
      totalAmount: totalAmount,
    });

    const savedOrder = await order.save();

    // Update book stock
    for (const cartItem of user.cart) {
      await Book.findByIdAndUpdate(cartItem.book._id, {
        $inc: { stock: -cartItem.quantity },
      });
    }

    // Clear the user's cart after successful order
    user.cart = [];
    await user.save();

    // Populate the saved order for response
    await savedOrder.populate("books.book");

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({
      message: "Error placing order",
      error: err.message,
    });
  }
});

// Place manual order (alternative endpoint)
router.post("/order/manual", jwtAuthMiddleWare, async (req, res) => {
  try {
    const userId = req.user.id;
    const { books, totalAmount } = req.body;

    if (!books || books.length === 0) {
      return res.status(400).json({ message: "No books in order" });
    }

    // Validate books and stock
    for (const orderBook of books) {
      const book = await Book.findById(orderBook.book);
      if (!book) {
        return res.status(404).json({
          message: `Book with ID ${orderBook.book} not found`,
        });
      }

      if (book.stock < orderBook.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${book.title}. Available: ${book.stock}, Requested: ${orderBook.quantity}`,
        });
      }
    }

    const order = new Order({
      user: userId,
      books: books,
      totalAmount: totalAmount,
    });

    const savedOrder = await order.save();

    // Update book stock
    for (const orderBook of books) {
      await Book.findByIdAndUpdate(orderBook.book, {
        $inc: { stock: -orderBook.quantity },
      });
    }

    await savedOrder.populate("books.book");

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (err) {
    console.error("Error placing manual order:", err);
    res.status(500).json({
      message: "Error placing order",
      error: err.message,
    });
  }
});

router.get("/orders", jwtAuthMiddleWare, async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ user: userId }).populate("books.book");
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json({
      message: "Orders retrieved successfully",
      orders: orders,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({
      message: "Error fetching orders",
      error: err.message,
    });
  }
});

router.get("/orders/:id", jwtAuthMiddleWare, async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({ _id: orderId, user: userId }).populate(
      "books.book"
    );
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
      message: "Error fetching order",
      error: err.message,
    });
  }
});

// Submit Complaint/Feedback
router.post("/complaint", jwtAuthMiddleWare, async (req, res) => {
  try {
    const { title, description, type, priority, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const complaint = new Complaint({
      user: req.user.id,
      title,
      description,
      type: type || "complaint",
      priority: priority || "medium",
      category: category || "other",
    });

    await complaint.save();

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (err) {
    console.error("Error submitting complaint:", err);
    res.status(500).json({
      success: false,
      message: "Error submitting complaint",
      error: err.message,
    });
  }
});

// Get user's complaints
router.get("/complaints", jwtAuthMiddleWare, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
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

// Get specific complaint
router.get("/complaint/:id", jwtAuthMiddleWare, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user.id,
    })
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

module.exports = router;
