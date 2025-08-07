import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { complaintAPI } from "../../utils/api";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiClock,
  FiUser,
  FiCalendar,
  FiTag,
} from "react-icons/fi";

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const response = await complaintAPI.getUserComplaint(id);
      setComplaint(response.data.complaint);
    } catch (error) {
      console.error("Error fetching complaint:", error);
      toast.error("Failed to fetch complaint details");
      navigate("/complaints");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
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
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Complaint not found</p>
          <button
            onClick={() => navigate("/complaints")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/complaints")}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <FiArrowLeft />
            <span>Back to Complaints</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Complaint Details
          </h1>
        </div>

        {/* Complaint Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Title and Status */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {complaint.title}
            </h2>
            <div className="flex space-x-2">
              <span className={getStatusBadge(complaint.status)}>
                {complaint.status.replace("-", " ").toUpperCase()}
              </span>
              <span className={getPriorityBadge(complaint.priority)}>
                {complaint.priority.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <FiTag className="text-purple-500" />
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">
                {complaint.type.replace("-", " ").toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FiTag className="text-indigo-500" />
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">
                {complaint.category.replace("-", " ").toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FiCalendar className="text-green-500" />
              <span className="text-gray-600">Submitted:</span>
              <span className="font-medium">
                {new Date(complaint.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FiClock className="text-orange-500" />
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">
                {new Date(complaint.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>
          </div>

          {/* Admin Response */}
          {complaint.adminResponse && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Admin Response
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap mb-3">
                  {complaint.adminResponse}
                </p>
                {complaint.respondedBy && complaint.respondedAt && (
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <FiUser />
                      <span>Responded by: {complaint.respondedBy.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiCalendar />
                      <span>
                        {new Date(complaint.respondedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No Response Message */}
          {!complaint.adminResponse && (
            <div className="border-t pt-6">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-yellow-800">
                  <strong>Status:</strong> Your complaint is being reviewed by
                  our admin team. You will receive a response soon.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate("/complaints")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Back to All Complaints
          </button>
          <button
            onClick={() => navigate("/submit-complaint")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Submit New Complaint
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
