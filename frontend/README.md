# BookStore Frontend

A modern React-based frontend for the BookStore application with comprehensive book management, user authentication, shopping cart, and admin panel features.

## Features

### User Features

- **Authentication**: Login/Register with photo upload
- **Book Browsing**: Search, filter, and view books by category
- **Shopping Cart**: Add, update, remove items from cart
- **Order Management**: Place orders and track order history
- **Profile Management**: Update user profile and view order history

### Admin Features

- **Dashboard**: Overview of books, orders, and revenue
- **Book Management**: Add, edit, delete books with image upload
- **Order Management**: View and update order status
- **Inventory Tracking**: Monitor stock levels

### Technical Features

- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Authentication**: JWT-based authentication with persistent login
- **Protected Routes**: Role-based access control
- **File Upload**: Image upload with Cloudinary integration
- **Real-time Updates**: Toast notifications for user feedback
- **Search & Filter**: Advanced search and filtering capabilities

## Tech Stack

- **React 19**: Modern React with hooks
- **React Router Dom**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Toastify**: Toast notifications
- **React Icons**: Icon library
- **Lodash**: Utility library
- **JS Cookie**: Cookie management
- **Vite**: Fast build tool and development server

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Configuration

Make sure your backend API is running on `http://localhost:3000`. If using a different URL, update the `API_BASE_URL` in `src/utils/api.js`.

## Project Structure

```
src/
├── components/
│   ├── admin/           # Admin-specific components
│   ├── auth/           # Authentication components
│   ├── books/          # Book-related components
│   ├── cart/           # Shopping cart components
│   ├── orders/         # Order management components
│   ├── profile/        # User profile components
│   ├── Navbar.jsx      # Navigation component
│   ├── Footer.jsx      # Footer component
│   ├── Home.jsx        # Home page component
│   ├── About.jsx       # About page component
│   └── ProtectedRoute.jsx # Route protection component
├── context/
│   └── AuthContext.jsx # Authentication context
├── utils/
│   └── api.js          # API utility functions
├── App.jsx             # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

## API Integration

The frontend integrates with the following backend APIs:

### User APIs

- `POST /user/register` - User registration
- `POST /user/login` - User login
- `GET /user/profile` - Get user profile
- `GET /user/allBooks` - Get all books
- `GET /user/book/:id` - Get specific book
- `POST /user/cart` - Add to cart
- `GET /user/cart` - Get cart items
- `PUT /user/cart/:bookId` - Update cart item
- `DELETE /user/cart/:bookId` - Remove from cart
- `DELETE /user/cart` - Clear cart
- `POST /user/order` - Place order
- `GET /user/orders` - Get user orders
- `GET /user/orders/:id` - Get specific order

### Admin APIs

- `POST /admin/addBook` - Add new book
- `POST /admin/updateBook/:id` - Update book
- `DELETE /admin/deleteBook/:id` - Delete book
- `GET /admin/allBooks` - Get all books (admin)
- `GET /admin/orders` - Get all orders
- `GET /admin/orders/:id` - Get specific order
- `PUT /admin/orders/:id` - Update order status

## Authentication

The application uses JWT-based authentication with the following features:

- **Persistent Login**: Tokens stored in cookies
- **Auto Logout**: Automatic logout on token expiration
- **Protected Routes**: Route-level authentication
- **Role-based Access**: Admin and user role separation

## State Management

- **React Context**: Authentication state management
- **Local State**: Component-level state with hooks
- **Cookie Storage**: Persistent user data storage

## Styling

The application uses Tailwind CSS for styling with:

- **Responsive Design**: Mobile-first approach
- **Component-based Styles**: Reusable style patterns
- **Consistent Theme**: Unified color scheme and typography
- **Accessibility**: ARIA labels and keyboard navigation

## Deployment

1. Build the application:

```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

3. Configure environment variables for production API URL

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
