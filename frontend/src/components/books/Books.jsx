import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userAPI } from "../../utils/api";
import { toast } from "react-toastify";
import { FiSearch, FiShoppingCart, FiEye } from "react-icons/fi";
import _ from "lodash";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, searchTerm, selectedCategory, sortBy]);

  const fetchBooks = async () => {
    try {
      const response = await userAPI.getAllBooks();
      setBooks(response.data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBooks = () => {
    let filtered = [...books];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    // Sort books
    filtered = _.orderBy(filtered, [sortBy], ["asc"]);

    setFilteredBooks(filtered);
  };

  const handleAddToCart = async (bookId) => {
    setAddingToCart((prev) => ({ ...prev, [bookId]: true }));
    try {
      await userAPI.addToCart({ bookId, quantity: 1 });
      toast.success("Book added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        error.response?.data?.message || "Failed to add book to cart"
      );
    } finally {
      setAddingToCart((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  const categories = _.uniq(books.map((book) => book.category)).filter(Boolean);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Books</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search books by title, author, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="price">Sort by Price</option>
              <option value="createdAt">Sort by Date Added</option>
            </select>
          </div>
        </div>
        {/* Results count */}
        <p className="text-gray-600 mb-4">
          Showing {filteredBooks.length} of {books.length} books
        </p>
      </div>
      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No books found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="aspect-w-3 aspect-h-4 bg-gray-200 flex items-center justify-center">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-gray-600 mb-2">by {book.author}</p>
                <p className="text-blue-600 mb-2">{book.category}</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {book.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-green-600">
                    <i class="fa-solid text-xl pr-1 fa-indian-rupee-sign"></i>{book.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {book.stock}
                  </span>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Link
                    to={`/books/${book._id}`}
                    className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-md hover:bg-gray-700 transition-colors text-center flex items-center justify-center"
                  >
                    <FiEye className="mr-1 h-4 w-4" />
                    View
                  </Link>
                  <button
                    onClick={() => handleAddToCart(book._id)}
                    disabled={book.stock === 0 || addingToCart[book._id]}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {addingToCart[book._id] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FiShoppingCart className="mr-1 h-4 w-4" />
                        {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
