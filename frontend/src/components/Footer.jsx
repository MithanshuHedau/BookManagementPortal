import React from "react";
import { Link } from "react-router-dom";
import {
  FiBook,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FiBook className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">BookStore</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your ultimate destination for books. Discover, explore, and
              purchase books from a vast collection of titles across all genres.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/mithanshu.hedau/"
                target="_blank"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FiFacebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/mithanshu-hedau-15066b282/"
                target="_blank"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FiLinkedin className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/mithanshuhedau/"
                target="_blank"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FiInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  target="_blank"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/books"
                  target="_blank"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Books
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  target="_blank"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  target="_blank"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <FiMapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">
                  Sai Nagar , Nandanvan , Nagpur
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">+91 (9096345738)</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">hedaumithanshu@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} BookStore By <span className="text-white">Mithanshu</span>. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
