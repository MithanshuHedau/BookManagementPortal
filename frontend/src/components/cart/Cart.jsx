import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAPI } from "../../utils/api";
import { toast } from "react-toastify";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await userAPI.getCart();
      setCart(response.data.cart || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating((prev) => ({ ...prev, [bookId]: true }));
    try {
      const response = await userAPI.updateCartItem(bookId, {
        quantity: newQuantity,
      });
      setCart(response.data.cart);
      toast.success("Cart updated successfully");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error(error.response?.data?.message || "Failed to update cart");
    } finally {
      setUpdating((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  const removeFromCart = async (bookId) => {
    setUpdating((prev) => ({ ...prev, [bookId]: true }));
    try {
      const response = await userAPI.removeFromCart(bookId);
      setCart(response.data.cart);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error(error.response?.data?.message || "Failed to remove item");
    } finally {
      setUpdating((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your entire cart?"))
      return;

    try {
      await userAPI.clearCart();
      setCart([]);
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  const placeOrder = async () => {
    setPlacingOrder(true);
    try {
      const response = await userAPI.placeOrder();
      toast.success("Order placed successfully!");
      setCart([]);
      navigate(`/orders/${response.data.order._id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => {
        return total + (item.book?.price || 0) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <FiShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any books to your cart yet.
          </p>
          <Link
            to="/books"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            Browse Books
            <FiArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Shopping Cart ({totalItems} items)
        </h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.book?._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center space-x-4">
                {/* Book Image */}
                <div className="flex-shrink-0">
                  {item.book?.image ? (
                    <img
                      src={item.book.image}
                      alt={item.book.title}
                      className="w-20 h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-24 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg mb-1">
                    <Link
                      to={`/books/${item.book?._id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {item.book?.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-2">by {item.book?.author}</p>
                  <p className="text-blue-600 text-sm">{item.book?.category}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.book._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1 || updating[item.book._id]}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiMinus className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-1 border border-gray-300 rounded min-w-[3rem] text-center">
                    {updating[item.book._id] ? "..." : item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.book._id, item.quantity + 1)
                    }
                    disabled={
                      updating[item.book._id] ||
                      item.quantity >= (item.book?.stock || 0)
                    }
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                </div>

                {/* Price and Remove */}
                <div className="text-right">
                  <p className="font-semibold text-lg text-green-600 mb-2">
                    ${((item.book?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.book._id)}
                    disabled={updating[item.book._id]}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div
                  key={item.book?._id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.book?.title} × {item.quantity}
                  </span>
                  <span>
                    ${((item.book?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-green-600">${calculateTotal()}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={placingOrder || cart.length === 0}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {placingOrder ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Placing Order...
                </div>
              ) : (
                "Place Order"
              )}
            </button>

            <Link
              to="/books"
              className="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
