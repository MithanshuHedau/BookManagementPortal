import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { complaintAPI } from "../../utils/api";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const UserComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await complaintAPI.getUserComplaints();
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-orange-500" />;
      case "in-progress":
        return <FiAlertCircle className="text-blue-500" />;
      case "resolved":
        return <FiCheckCircle className="text-green-500" />;
      case "closed":
        return <FiCheckCircle className="text-gray-500" />;
      default:
        return <FiClock className="text-orange-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "pending":
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case "in-progress":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "resolved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "closed":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (priority) {
      case "urgent":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "high":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "medium":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "low":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    if (selectedStatus && complaint.status !== selectedStatus) return false;
    if (selectedType && complaint.type !== selectedType) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            My Complaints & Feedback
          </h1>
          <Link
            to="/submit-complaint"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
          >
            <FiPlus />
            <span>New Complaint</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="complaint">Complaint</option>
                <option value="feedback">Feedback</option>
                <option value="suggestion">Suggestion</option>
                <option value="bug-report">Bug Report</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">
              {complaints.length === 0
                ? "You haven't submitted any complaints yet."
                : "No complaints match your filters."}
            </p>
            {complaints.length === 0 && (
              <Link
                to="/submit-complaint"
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
              >
                Submit Your First Complaint
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(complaint.status)}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {complaint.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {complaint.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={getStatusBadge(complaint.status)}>
                        {complaint.status.replace("-", " ").toUpperCase()}
                      </span>
                      <span className={getPriorityBadge(complaint.priority)}>
                        {complaint.priority.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {complaint.type.replace("-", " ").toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                        {complaint.category.replace("-", " ").toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Submitted:{" "}
                      {new Date(complaint.createdAt).toLocaleDateString()}
                      {complaint.respondedAt && (
                        <span className="ml-4">
                          Responded:{" "}
                          {new Date(complaint.respondedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/complaint/${complaint._id}`}
                    className="ml-4 bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition duration-200"
                  >
                    <FiEye size={20} />
                  </Link>
                </div>

                {complaint.adminResponse && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Admin Response:
                    </h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {complaint.adminResponse}
                    </p>
                    {complaint.respondedBy && (
                      <p className="text-xs text-gray-500 mt-2">
                        Responded by: {complaint.respondedBy.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserComplaints;
