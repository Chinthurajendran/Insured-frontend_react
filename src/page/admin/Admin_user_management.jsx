import React, { useState, useEffect } from "react";
import AdminTable from "../../components/admin_compnents/AdminTable";
import axios from "axios";
import { baseURL } from "../../baseUrls/Urls";
import { AwardIcon } from "lucide-react";
import { toast } from "react-toastify";

const userColumns = [
  { key: "image", label: "Image" },
  { key: "username", label: "Name" },
  { key: "email", label: "Email" },
  { key: "gender", label: "Gender" },
  { key: "phone", label: "Phone" },
  { key: "date_of_birth", label: "Date of Birth" },
  { key: "annual_income", label: "Annual Income" },
  { key: "marital_status", label: "Marital Status" },
  { key: "city", label: "City" },
  { key: "policy_status", label: "Policy Status" },
  { key: "block_status", label: "Block Status" },
];

const Admin_user_management = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("admin_access_token");
  const [formError, setFormError] = useState(""); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseURL}/admin_auth/user_date`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUsers(response.data.users || response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleBlockToggle = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, block_status: !user.block_status } : user
      )
    );
  };
  console.log(users)

  const handleDeleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  return loading ? (
    <p>Loading users...</p>
  ) : (
    <AdminTable
      users={users}
      columns={userColumns}
      title="User Management"
      onBlockToggle={handleBlockToggle}
      onDelete={handleDeleteUser}
    />
  );
};

export default Admin_user_management;
