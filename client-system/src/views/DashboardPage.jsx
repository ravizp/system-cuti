import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EditLeaveModal } from "./EditLeaveModal";
import { CreateLeaveModal } from "./CreateLeaveModal";

export default function DashboardPage({ url }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingLeave, setEditingLeave] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [employeeSummary, setEmployeeSummary] = useState({
    name: "N/A",
    usedLeave: 0,
    remainingLeave: 12,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      navigate("/login");
      return;
    }
    fetchLeaves();
  }, [navigate]);

  const fetchLeaves = async () => {
    setLoading(true);
    setError(null);
    try {
      const access_token = localStorage.getItem("access_token");
      const response = await fetch(`${url}/leaves-employee-login`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login");
          return;
        }
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (result.status === "success") {
        // Normalize the data structure
        const formattedLeaves = result.data.map((leave) => ({
          ...leave,
          Employee: leave.Employee || leave.employee || { name: "N/A" },
        }));
        setLeaves(formattedLeaves);

        // Calculate total used leave days
        const totalUsedDays = formattedLeaves.reduce((total, leave) => {
          return total + (Number(leave.day) || Number(leave.days) || 0);
        }, 0);

        // Set employee summary
        if (formattedLeaves.length > 0) {
          const firstLeave = formattedLeaves[0];
          setEmployeeSummary({
            name:
              firstLeave.Employee?.nama || firstLeave.employee?.nama || "N/A",
            usedLeave: totalUsedDays,
            remainingLeave: Math.max(12 - totalUsedDays, 0),
          });
        }
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (leave) => {
    setEditingLeave(leave);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (formData) => {
    try {
      const access_token = localStorage.getItem("access_token");
      const response = await fetch(`${url}/leaves/${editingLeave.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update leave");
      }

      // Close modal and refresh data
      setIsEditModalOpen(false);
      setEditingLeave(null);
      await fetchLeaves();
    } catch (err) {
      console.error("Error updating leave:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    }
  };

  const handleDelete = async (id) => {
    // Set loading state for the specific delete button
    setDeleteLoading(id);

    try {
      const access_token = localStorage.getItem("access_token");
      const response = await fetch(`${url}/leaves/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login");
          return;
        }
        throw new Error("Failed to delete");
      }

      // Remove the deleted item from the state immediately
      setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave.id !== id));
    } catch (err) {
      console.error("Error deleting leave:", err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCreateLeave = async (formData) => {
    try {
      const access_token = localStorage.getItem("access_token");
      const response = await fetch(`${url}/leaves`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create leave");
      }

      // Close modal and refresh data
      setIsCreateModalOpen(false);
      await fetchLeaves();
    } catch (err) {
      console.error("Error creating leave:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#5D4B8E] text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">PT. LAPI LABORATORIES</h1>
          <button className="lg:hidden">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <svg
            className="h-5 w-5 cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <div className="relative group">
            <svg
              className="h-5 w-5 cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-[#373B53] text-white p-4 hidden lg:block">
          <nav className="space-y-4">
            <div className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Website</span>
              <svg
                className="h-4 w-4 ml-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="text-sm text-gray-600 mb-6">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
              onClick={() => setIsCreateModalOpen(true)}>
              Create Leaves/Cuti
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">
              Daftar Pengajuan Cuti PT LAPI LABORATORIES
            </h2>

            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Nama</th>
                      <th className="px-4 py-2 text-left">Tanggal Cuti</th>
                      <th className="px-4 py-2 text-left">Total Day</th>
                      <th className="px-4 py-2 text-left">Keterangan</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Message</th>
                      <th className="px-4 py-2 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((leave) => (
                      <tr key={leave.id} className="border-t">
                        <td className="px-4 py-2">{leave.Employee.nama}</td>
                        <td className="px-4 py-2">
                          Dari {formatDate(leave.dateFrom)} Sampai{" "}
                          {formatDate(leave.dateTo)}
                        </td>
                        <td className="px-4 py-2">
                          {leave.day || leave.days} Hari
                        </td>
                        <td className="px-4 py-2">{leave.description}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              leave.status === "draft"
                                ? "bg-gray-200"
                                : leave.status === "Approve Manager"
                                ? "bg-green-200"
                                : "bg-blue-200"
                            }`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{leave.message}</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(leave)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this leave request?"
                                  )
                                ) {
                                  handleDelete(leave.id);
                                }
                              }}
                              disabled={deleteLoading === leave.id}
                              className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 ${
                                deleteLoading === leave.id
                                  ? "cursor-not-allowed"
                                  : ""
                              }`}>
                              {deleteLoading === leave.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <h2 className="mt-4 text-lg font-semibold">
                    Sisa Cuti: {employeeSummary.remainingLeave} days
                    <br />
                    Cuti Terpakai:{employeeSummary.usedLeave} days
                  </h2>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      <EditLeaveModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingLeave(null);
        }}
        onSubmit={handleEditSubmit}
        leaveData={editingLeave}
      />
      {/* Create Modal */}
      <CreateLeaveModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLeave}
        currentEmployeeName={employeeSummary.name}
        url={url}
      />
    </div>
  );
}
