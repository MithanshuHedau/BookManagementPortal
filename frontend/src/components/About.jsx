import React from "react";
import { FiBook, FiUsers, FiAward, FiHeart } from "react-icons/fi";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About BookStore
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are passionate about connecting readers with the books they
              love. Our mission is to make quality literature accessible to
              everyone, everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-700 mb-4">
                Founded in 2020, BookStore began as a small independent
                bookstore with a big dream: to create a community where book
                lovers could discover, explore, and share their passion for
                reading.
              </p>
              <p className="text-gray-700 mb-4">
                Today, we've grown into a comprehensive online platform that
                serves thousands of readers worldwide, offering an extensive
                collection of books across all genres and categories.
              </p>
              <p className="text-gray-700">
                Our commitment remains the same - to provide exceptional
                service, competitive prices, and a curated selection of quality
                books that inspire, educate, and entertain.
              </p>
            </div>
            <div className="bg-blue-100 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    1,000+  
                  </div>
                  <p className="text-gray-600">Books Available Soon</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    50+
                  </div>
                  <p className="text-gray-600">Happy Customers</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    10+
                  </div>
                  <p className="text-gray-600">Categories Soon</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    24/7
                  </div>
                  <p className="text-gray-600">Customer Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBook className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Selection</h3>
              <p className="text-gray-600">
                We carefully curate our collection to ensure every book meets
                our high standards for quality and relevance.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Focus</h3>
              <p className="text-gray-600">
                We believe in building a community of readers who can discover,
                share, and discuss their favorite books.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every aspect of our service, from
                book selection to customer support.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Passion</h3>
              <p className="text-gray-600">
                Our love for books and reading drives everything we do. We're
                readers serving readers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-xl mb-6 max-w-3xl mx-auto">
              To make reading accessible, enjoyable, and enriching for everyone
              by providing a seamless book discovery and purchasing experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
                <p className="text-blue-100">
                  Making books available to readers everywhere, regardless of
                  location or budget.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Discovery</h3>
                <p className="text-blue-100">
                  Helping readers discover their next favorite book through
                  personalized recommendations.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Community</h3>
                <p className="text-blue-100">
                  Building connections between readers and fostering a love for
                  literature.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
              Our dedicated team is united by a shared love for books and a
              commitment to delivering the best experience for our readers.
            </p>
            <p className="text-lg text-gray-500">
              Get to know the passionate people who bring BookStore to life.
            </p>
          </div>

          {/* Team Photo with Overlay */}
          <div className="relative mb-16">
            <div className="flex justify-center">
              <div className="relative group">
                <div className="w-full max-w-4xl h-80 overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="/team.jpg"
                    alt="Our Team"
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    The BookStore Family
                  </h3>
                  <p className="text-blue-100">
                    United by our passion for literature
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
                <p className="text-gray-600 font-medium">Team Members</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-green-600 mb-2">1+</div>
                <p className="text-gray-600 font-medium">Years Experience</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  24/7
                </div>
                <p className="text-gray-600 font-medium">Dedicated Support</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-red-600 mb-2">100%</div>
                <p className="text-gray-600 font-medium">Book Lovers</p>
              </div>
            </div>
          </div>

          {/* Team Description */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                From curating our vast collection to providing top-notch
                customer support, our team works tirelessly to ensure every
                reader finds their next great read. We believe in collaboration,
                creativity, and a genuine passion for connecting people with
                stories that inspire.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="flex flex-col items-center p-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                    <FiBook className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Curation Experts
                  </h4>
                  <p className="text-sm text-gray-600 text-center">
                    Carefully selecting the best books for our readers
                  </p>
                </div>
                <div className="flex flex-col items-center p-4">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                    <FiUsers className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Customer Champions
                  </h4>
                  <p className="text-sm text-gray-600 text-center">
                    Always ready to help with your reading journey
                  </p>
                </div>
                <div className="flex flex-col items-center p-4">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                    <FiHeart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Story Enthusiasts
                  </h4>
                  <p className="text-sm text-gray-600 text-center">
                    Sharing our love for literature with the world
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email Us
              </h3>
              <p className="text-gray-600">hedaumithanshu@gmail.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Call Us
              </h3>
              <p className="text-gray-600">+91 (9096345738)</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Visit Us
              </h3>
              <p className="text-gray-600">
                Sai Nagar , Nandanvan , Nagpur
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
