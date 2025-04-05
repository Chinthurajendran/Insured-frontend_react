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
import axiosInstance from "../../Interceptors/admin";

function DashboardGraph() {
  const [chartData, setChartData] = useState([]);
  const [agentPolicyCount, setAgentPolicyCount] = useState(0);
  const [nonAgentPolicyCount, setNonAgentPolicyCount] = useState(0);
  const [policyStatusCounts, setPolicyStatusCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [policyStatusVisible, setPolicyStatusVisible] = useState(false); 

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const [policiesRes, agentRes, paymentRes] = await Promise.all([
          axiosInstance.get("policiespermonth"),
          axiosInstance.get("policytakenbyagent"),
          axiosInstance.get("policypaymentinfo"),
        ]);

        const policies = policiesRes.data.policies || [];
        const agentPolicies = agentRes.data.policies || [];
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
        const totalPoliciesThisMonth = policies.filter((policy) =>
          policy.create_at.startsWith(currentMonth)
        ).length;
        const agentPoliciesThisMonth = agentPolicies.filter((policy) =>
          policy.create_at.startsWith(currentMonth)
        ).length;

        setAgentPolicyCount(agentPoliciesThisMonth);
        setNonAgentPolicyCount(
          Math.max(totalPoliciesThisMonth - agentPoliciesThisMonth, 0)
        );

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
        }, 1000);

      } catch (error) {
        console.error("Error fetching policy data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyData();
  }, []);

  const pieData = useMemo(
    () => [
      { name: "Agent Policies", value: agentPolicyCount },
      { name: "Non-Agent Policies", value: nonAgentPolicyCount },
    ],
    [agentPolicyCount, nonAgentPolicyCount]
  );

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
    <div className="w-full h-auto flex flex-col items-center gap-8">
      {loading ? (
        <div className="w-full h-96 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="w-1/2 h-8 bg-gray-300 mb-4"></div>
            <div className="w-1/4 h-4 bg-gray-300"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full h-96">
            <h2 className="text-xl font-semibold text-center mb-4">
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

          <div className="w-full flex flex-row justify-center gap-16">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
                Agent vs Direct Policies (Monthly Overview)
              </h2>
              <PieChart width={400} height={300}>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={110}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#4F46E5", "#E53935"][index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>

            {policyStatusVisible && (
              <div className="flex flex-col items-center">
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
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardGraph;
