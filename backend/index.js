const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./connection/db");
const cors = require("cors");

/* MiddleWare Start*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
/*MiddleWare End*/

/*Import Routes */
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Welcome to Book Management System");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
  console.log(`Website is running on http://localhost:${PORT}`);
});
