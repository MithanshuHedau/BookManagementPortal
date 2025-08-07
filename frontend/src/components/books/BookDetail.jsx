import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userAPI } from "../../utils/api";
import { toast } from "react-toastify";
import { FiArrowLeft, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await userAPI.getBook(id);
      setBook(response.data.book);
    } catch (error) {
      console.error("Error fetching book:", error);
      toast.error("Failed to fetch book details");
      navigate("/books");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await userAPI.addToCart({ bookId: book._id, quantity });
      toast.success(`${quantity} book(s) added to cart successfully!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        error.response?.data?.message || "Failed to add book to cart"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= book.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Book not found</h2>
          <button
            onClick={() => navigate("/books")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/books")}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2 h-5 w-5" />
        Back to Books
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Book Image */}
        <div className="aspect-w-3 aspect-h-4">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-lg">No Image Available</span>
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-gray-600">by {book.author}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {book.category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                book.stock > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {book.description || "No description available."}
            </p>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-green-600">
                <i class="fa-solid text-2xl p-2 fa-indian-rupee-sign"></i>{book.price}
              </span>
              <span className="text-sm text-gray-500">
                Added on {new Date(book.createdAt).toLocaleDateString()}
              </span>
            </div>

            {book.stock > 0 && (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiMinus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= book.stock}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Max: {book.stock}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {addingToCart ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding to Cart...
                    </div>
                  ) : (
                    <>
                      <FiShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </button>

                {/* Total Price */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${(book.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {book.stock === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 font-medium">
                  This book is currently out of stock.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
