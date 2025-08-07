import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/api";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiCalendar,
  FiSave,
  FiTrash2,
} from "react-icons/fi";

const AdminComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const res = await adminAPI.getComplaint(id);
      const complaintData = res.data.complaint;
      setComplaint(complaintData);
      setResponse(complaintData.adminResponse || "");
      setStatus(complaintData.status);
      setPriority(complaintData.priority);
    } catch (error) {
      console.error("Error fetching complaint:", error);
      toast.error("Failed to fetch complaint details");
      navigate("/admin/complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!response.trim()) {
      toast.error("Please provide a response");
      return;
    }

    setUpdating(true);
    try {
      const updateData = {
        status,
        priority,
        adminResponse: response,
      };

      const res = await adminAPI.updateComplaint(id, updateData);
      if (res.data.success) {
        toast.success("Complaint updated successfully");
        setComplaint(res.data.complaint);
      }
    } catch (error) {
      console.error("Error updating complaint:", error);
      toast.error(
        error.response?.data?.message || "Failed to update complaint"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) {
      return;
    }

    try {
      await adminAPI.deleteComplaint(id);
      toast.success("Complaint deleted successfully");
      navigate("/admin/complaints");
    } catch (error) {
      console.error("Error deleting complaint:", error);
      toast.error("Failed to delete complaint");
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
            onClick={() => navigate("/admin/complaints")}
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/complaints")}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <FiArrowLeft />
            <span>Back to Complaints</span>
          </button>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Complaint Management
            </h1>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
            >
              <FiTrash2 />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Complaint Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
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

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium">
                    {complaint.type.replace("-", " ").toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium">
                    {complaint.category.replace("-", " ").toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>
                  <span className="ml-2 font-medium">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="ml-2 font-medium">
                    {new Date(complaint.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {complaint.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Response Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Admin Response
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Message
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Write your response to the customer..."
                  rows={6}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleUpdate}
                disabled={updating || !response.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
              >
                <FiSave />
                <span>{updating ? "Updating..." : "Update Response"}</span>
              </button>
            </div>
          </div>

          {/* Customer Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Customer Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FiUser className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">
                      {complaint.user?.name || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FiMail className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">
                      {complaint.user?.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FiCalendar className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Submitted On</p>
                    <p className="font-medium">
                      {new Date(complaint.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Response */}
            {complaint.adminResponse && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Previous Response
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap mb-2">
                    {complaint.adminResponse}
                  </p>
                  {complaint.respondedBy && complaint.respondedAt && (
                    <div className="text-sm text-gray-600">
                      <p>Responded by: {complaint.respondedBy.name}</p>
                      <p>
                        On:{" "}
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
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetail;
