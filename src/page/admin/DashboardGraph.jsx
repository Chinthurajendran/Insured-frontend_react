import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import axiosInstance from "../../Interceptors/admin";

function DashboardGraph() {
  const [chartData, setChartData] = useState([]);

  const processData = (data) => {
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(currentYear, i).toISOString().slice(0, 7),
      count: 0,
    }));


    data.forEach(({ create_at }) => {
      const policyDate = new Date(create_at);
      if (policyDate.getFullYear() === currentYear) {
        const monthIndex = policyDate.getMonth();
        months[monthIndex].count += 1;
      }
    });

    return months;
  };

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await axiosInstance.get(`policiespermonth`);
        const policies = response.data.policies || [];
        setChartData(processData(policies));
      } catch (error) {
        console.error("Error fetching policy data:", error);
      }
    };

    fetchPolicyData();
  }, []);

  return (
    <div className="w-full h-96">
      <h2 className="text-xl font-semibold text-center mb-4">Policies Per Month (Current Year)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={(month) => new Date(month).toLocaleString("default", { month: "short" })} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#4F46E5" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DashboardGraph;
