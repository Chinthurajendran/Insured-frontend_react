import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import axiosInstance from "../../Interceptors/agent";
import { useSelector } from "react-redux";

function DashboardGraph() {
  const [chartData, setChartData] = useState([]);
  const [policyStatusCounts, setPolicyStatusCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [policyStatusVisible, setPolicyStatusVisible] = useState(false);
  const agentId = useSelector((state) => state.agentAuth.agent_uuid)

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const [policiesRes, paymentRes] = await Promise.all([
          axiosInstance.get(`policiespermonth/${agentId}`),
          axiosInstance.get(`policypaymentinfo/${agentId}`),
        ]);

        const policies = policiesRes.data.policies || [];
        const allPolicies = paymentRes.data.policies || [];

        const currentYear = new Date().getFullYear();
        const months = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(currentYear, i).toISOString().slice(0, 7),
          count: 0,
        }));

        policies.forEach(({ create_at }) => {
          const policyDate = new Date(create_at);
          if (policyDate.getFullYear() === currentYear) {
            months[policyDate.getMonth()].count += 1;
          }
        });

        setChartData(months);

        const currentMonth = new Date().toISOString().slice(0, 7);

        setPolicyStatusCounts({
          approved: allPolicies.filter(
            (policy) =>
              policy.create_at.startsWith(currentMonth) &&
              policy.policy_status.toLowerCase() === "approved"
          ).length,
          processing: allPolicies.filter(
            (policy) =>
              policy.create_at.startsWith(currentMonth) &&
              policy.policy_status.toLowerCase() === "processing"
          ).length,
          rejected: allPolicies.filter(
            (policy) =>
              policy.create_at.startsWith(currentMonth) &&
              policy.policy_status.toLowerCase() === "rejected"
          ).length,
        });

        setTimeout(() => {
          setPolicyStatusVisible(true);
        }, 400);
      } catch (error) {
        console.error("Error fetching policy data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyData();
  }, []);

  const statusData = useMemo(
    () =>
      policyStatusCounts
        ? [
            { name: "Approved", value: policyStatusCounts.approved },
            { name: "Processing", value: policyStatusCounts.processing },
            { name: "Rejected", value: policyStatusCounts.rejected },
          ]
        : [],
    [policyStatusCounts]
  );

  return (
    <div className="w-full h-auto flex flex-col items-center gap-8 mt-20">
      {loading ? (
        <div className="w-full h-96 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="w-1/2 h-8 bg-gray-300 mb-4"></div>
            <div className="w-1/4 h-4 bg-gray-300"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <div className="w-full md:w-2/3 h-96">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
              Policies Per Month (Current Year)
            </h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(month) =>
                    new Date(month).toLocaleString("default", { month: "short" })
                  }
                />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => `${value} Policies`} />
                <Bar dataKey="count" fill="#4F46E5" barSize={40} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

     
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
                Policy Status (Current Month)
              </h2>
              <PieChart width={400} height={300}>
                <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={110}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#28a745", "#ffc107", "#dc3545"][index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>

        </div>
      )}
    </div>
  );
}

export default DashboardGraph;
