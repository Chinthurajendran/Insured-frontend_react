import React from 'react';
import { Trash2 } from "lucide-react";

const users = [
  {
    id: 1,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-05%20131934-0JlUNKX6AEhYryfdd3oAdDDOUfTmUU.png",
    name: "Chinthu rajendran",
    email: "Chinturajendran1512@gmail.com",
    gender: "Male",
    phone: "9745474547",
    dateOfBirth: "15-12-1997",
    annualIncome: 100000,
    maritalStatus: "Single",
    city: "Kochi",
    isActive: true,
  },
];

const Admin_user_list = () => {
  return (
    <div className="container mx-auto p-6 max-w-screen-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button className="bg-gray-300 px-4 py-2 rounded">Create user</button>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="w-full min-w-[1200px] bg-gray-200 rounded-lg border border-gray-300">
          <thead>
            <tr className="bg-green-800 text-white rounded-t-lg">
              <th className="p-3 text-left whitespace-nowrap">Image</th>
              <th className="p-3 text-left whitespace-nowrap">Name</th>
              <th className="p-3 text-left whitespace-nowrap">Email</th>
              <th className="p-3 text-left whitespace-nowrap">Gender</th>
              <th className="p-3 text-left whitespace-nowrap">Phone</th>
              <th className="p-3 text-left whitespace-nowrap">Date of birth</th>
              <th className="p-3 text-left whitespace-nowrap">Annual income</th>
              <th className="p-3 text-left whitespace-nowrap">Marital status</th>
              <th className="p-3 text-left whitespace-nowrap">City</th>
              <th className="p-3 text-left whitespace-nowrap">Policy status</th>
              <th className="p-3 text-left whitespace-nowrap">Status</th>
              <th className="p-3 text-left whitespace-nowrap">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}>
                <td className="p-3 whitespace-nowrap">
                  <img
                    src={user.image || "/placeholder.svg"}
                    alt={`${user.name}'s avatar`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </td>
                <td className="p-3 whitespace-nowrap">{user.name}</td>
                <td className="p-3 whitespace-nowrap">{user.email}</td>
                <td className="p-3 whitespace-nowrap">{user.gender}</td>
                <td className="p-3 whitespace-nowrap">{user.phone}</td>
                <td className="p-3 whitespace-nowrap">{user.dateOfBirth}</td>
                <td className="p-3 whitespace-nowrap">{user.annualIncome.toLocaleString()}</td>
                <td className="p-3 whitespace-nowrap">{user.maritalStatus}</td>
                <td className="p-3 whitespace-nowrap">{user.city}</td>
                <td className="p-3 whitespace-nowrap">
                  <span className="px-3 py-1 bg-yellow-400 text-black rounded-full text-sm">Active</span>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <button className={`px-3 py-1 text-sm ${user.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {user.isActive ? "Active" : "Block"}
                  </button>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <button className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin_user_list;
