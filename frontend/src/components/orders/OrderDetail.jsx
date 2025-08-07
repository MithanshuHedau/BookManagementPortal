import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userAPI } from "../../utils/api";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiCalendar,
  FiDollarSign,
  FiPackage,
  FiTruck,
  FiCheck,
} from "react-icons/fi";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await userAPI.getOrder(id);
      setOrder(response.data.order);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to fetch order details");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiPackage className="h-5 w-5" />;
      case "shipped":
        return <FiTruck className="h-5 w-5" />;
      case "delivered":
        return <FiCheck className="h-5 w-5" />;
      default:
        return <FiPackage className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
          <button
            onClick={() => navigate("/orders")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2 h-5 w-5" />
        Back to Orders
      </button>

      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
              Order #{order._id.slice(-8)}
            </h1>
            <div className="flex items-center space-x-2">
              {getStatusIcon(order.status)}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <FiCalendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Order Date</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.orderedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FiDollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Total Amount
                </p>
                <p className="text-lg font-bold text-green-600">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FiPackage className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Items</p>
                <p className="text-sm text-gray-600">
                  {order.books.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}{" "}
                  item(s)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {order.books.map((item, index) => (
            <div key={index} className="px-6 py-4">
              <div className="flex items-center space-x-4">
                {/* Book Image */}
                <div className="flex-shrink-0">
                  {item.book?.image ? (
                    <img
                      src={item.book.image}
                      alt={item.book?.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.book?.title || "Book not found"}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    by {item.book?.author || "Unknown Author"}
                  </p>
                  <p className="text-blue-600 text-sm">
                    {item.book?.category || "Category not available"}
                  </p>
                </div>

                {/* Quantity and Price */}
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Price: ${item.book?.price?.toFixed(2) || "0.00"} each
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    ${((item.book?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Total */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-green-600">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-lg shadow-md mt-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-2 ${
                order.status === "pending" ? "text-yellow-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  order.status === "pending" ? "bg-yellow-600" : "bg-gray-300"
                }`}
              ></div>
              <span className="text-sm font-medium">Pending</span>
            </div>

            <div
              className={`flex items-center space-x-2 ${
                order.status === "shipped"
                  ? "text-blue-600"
                  : order.status === "delivered"
                  ? "text-gray-400"
                  : "text-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  order.status === "shipped"
                    ? "bg-blue-600"
                    : order.status === "delivered"
                    ? "bg-gray-400"
                    : "bg-gray-300"
                }`}
              ></div>
              <span className="text-sm font-medium">Shipped</span>
            </div>

            <div
              className={`flex items-center space-x-2 ${
                order.status === "delivered"
                  ? "text-green-600"
                  : "text-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  order.status === "delivered" ? "bg-green-600" : "bg-gray-300"
                }`}
              ></div>
              <span className="text-sm font-medium">Delivered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
