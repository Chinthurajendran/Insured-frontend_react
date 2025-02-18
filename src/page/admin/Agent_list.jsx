import React, { useState, useEffect } from "react";
import AdminTable from "../../components/admin_compnents/AdminTable";
import axiosInstance from "../../Interceptors/admin";
import { toast } from "react-toastify"

const userColumns = [
  { key: "image", label: "Image" },
  { key: "agentid", label: "Agent ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "gender", label: "Gender" },
  { key: "phone", label: "Phone" },
  { key: "date_of_birth", label: "Date of Birth" },
  { key: "city", label: "City" },
  { key: "status", label: "Login Status" },
  { key: "block_status", label: "Block Status" },
];

const Agent_list = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("admin_access_token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`agent_list`);

        if (response.status === 200) {
          setUsers(response.data.agents || response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleBlockToggle = async (userId) => {

    try {
      const response = await axiosInstance.put(`agent_block/${userId}`);
      if (response.status === 200) {
        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.map((user) =>
            user.agentuid === userId
              ? { ...user, block_status: !user.block_status }
              : user
          );
          return updatedUsers;
        });
        toast.success("User block status updated successfully.");
      }
    } catch (error) {
      toast.error("Failed to update block status.");
    }
  };



  const handleDeleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  console.log("weee",users)
  return loading ? (
    <p>Loading users...</p>
  ) : (
    <AdminTable
      users={users}
      columns={userColumns}
      title="Agent list"
      onBlockToggle={handleBlockToggle}
      onDelete={handleDeleteUser}
      buttonlink="/Policy_create_page"
    />
  );
};

export default Agent_list;
