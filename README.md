# 📚 Book Management Portal

A comprehensive full-stack web application for managing books, orders, and customer complaints. Built with modern web technologies including React, Node.js, Express, and MongoDB.

## 🌟 Features

### 🔐 Authentication & Authorization

- **User Registration & Login** with JWT authentication
- **Role-based access control** (User/Admin)
- **Protected routes** for secure access
- **Profile management** with photo upload

### 📖 Book Management

- **Browse books** with search and filtering
- **Detailed book information** with images
- **Category-based filtering**
- **Admin book management** (CRUD operations)
- **Image upload** with Cloudinary integration

### 🛒 Shopping & Orders

- **Shopping cart** functionality
- **Order placement** and tracking
- **Order history** for users
- **Admin order management**
- **Order status updates**

### 📞 Customer Support

- **Complaint/Feedback system**
- **User complaint submission**
- **Admin complaint management**
- **Response tracking**
- **Status management** (Pending, In-Progress, Resolved, Closed)

### 📊 Admin Dashboard

- **Statistics overview**
- **Order management**
- **Book inventory management**
- **Customer complaint handling**
- **User management**

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI Library
- **Vite** - Build tool
- **React Router DOM** - Navigation
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **js-cookie** - Cookie management
- **Lodash** - Utility functions

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload
- **Cloudinary** - Image storage
- **CORS** - Cross-origin requests

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud)
- **Cloudinary account** (for image uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MithanshuHedau/BookManagementPortal.git
   cd BookManagementPortal
   ```
2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:

   ```env

   ```

   Start the backend server:

   ```bash
   npm run dev
   ```
3. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install
   ```

   Update the API base URL in `src/utils/api.js`:

   ```javascript
   const API_BASE_URL = "http://localhost:3000"; // For local development
   // or
   const API_BASE_URL = "https://bookmithanshuapi.onrender.com"; // For production
   ```

   Start the frontend development server:

   ```bash
   npm run dev
   ```
4. **Access the application**

   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

## 📁 Project Structure

```
BookManagementPortal/
├── backend/
│   ├── connection/
│   │   └── db.js              # Database connection
│   ├── model/
│   │   ├── book.js            # Book model
│   │   ├── user.js            # User model
│   │   ├── order.js           # Order model
│   │   └── complaint.js       # Complaint model
│   ├── routes/
│   │   ├── adminRoutes.js     # Admin API routes
│   │   └── userRoutes.js      # User API routes
│   ├── uploads/               # File upload directory
│   ├── index.js               # Server entry point
│   ├── jwt.js                 # JWT utilities
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── admin/         # Admin components
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── books/         # Book-related components
│   │   │   ├── cart/          # Shopping cart components
│   │   │   ├── complaints/    # Complaint system components
│   │   │   ├── orders/        # Order management components
│   │   │   └── profile/       # User profile components
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── utils/
│   │   │   └── api.js         # API configuration
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔑 API Endpoints

### Authentication

- `POST /user/register` - User registration
- `POST /user/login` - User login
- `GET /user/profile` - Get user profile
- `GET /user/check-admin` - Check if admin exists

### Books

- `GET /user/books` - Get all books (public)
- `GET /user/books/:id` - Get book details
- `POST /admin/addBook` - Add new book (admin)
- `PUT /admin/updateBook/:id` - Update book (admin)
- `DELETE /admin/deleteBook/:id` - Delete book (admin)

### Orders

- `POST /user/placeOrder` - Place an order
- `GET /user/orders` - Get user orders
- `GET /user/orders/:id` - Get order details
- `GET /admin/orders` - Get all orders (admin)
- `PUT /admin/orders/:id` - Update order status (admin)

### Complaints

- `POST /user/complaint` - Submit complaint
- `GET /user/complaints` - Get user complaints
- `GET /user/complaint/:id` - Get complaint details
- `GET /admin/complaints` - Get all complaints (admin)
- `PUT /admin/complaint/:id` - Update complaint (admin)
- `DELETE /admin/complaint/:id` - Delete complaint (admin)

### Cart Management

- `POST /user/addToCart` - Add item to cart
- `GET /user/cart` - Get user cart
- `PUT /user/cart/:bookId` - Update cart item
- `DELETE /user/cart/:bookId` - Remove from cart

## 👥 User Roles

### 👤 Regular Users

- Browse and search books
- Add books to cart
- Place orders
- View order history
- Submit complaints/feedback
- View their own complaints
- Manage profile

### 👨‍💼 Admin Users

- All user permissions
- Manage book inventory (CRUD)
- View and manage all orders
- Update order statuses
- View and respond to all complaints
- Access admin dashboard with statistics
- Manage user accounts

## 🎨 UI/UX Features

- **Responsive design** - Works on all device sizes
- **Modern UI** - Clean and intuitive interface
- **Real-time notifications** - Toast notifications for user feedback
- **Loading states** - Smooth loading indicators
- **Error handling** - Comprehensive error messages
- **Search & filtering** - Easy book discovery
- **Pagination** - Efficient data loading

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password hashing** - bcrypt for password security
- **Protected routes** - Route-level access control
- **Input validation** - Server-side validation
- **CORS configuration** - Secure cross-origin requests
- **File upload validation** - Secure image uploads

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:

- **Desktop** (1024px and above)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🚀 Deployment

### Backend Deployment (Render)

The backend is deployed on Render: `https://bookmithanshuapi.onrender.com`

### Frontend Deployment

Can be deployed on platforms like:

- **Vercel**
- **Netlify**
- **GitHub Pages**

## 📄 Environment Variables

### Backend (.env)

```env

```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Mithanshu Hedau**

- GitHub: [@MithanshuHedau](https://github.com/MithanshuHedau)
- Project Link: [BookManagementPortal](https://github.com/MithanshuHedau/BookManagementPortal)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors who made this project possible

## 📞 Support

If you have any questions or need help with the project, please open an issue on GitHub or contact the author.

---

**Happy Coding! 🚀**
