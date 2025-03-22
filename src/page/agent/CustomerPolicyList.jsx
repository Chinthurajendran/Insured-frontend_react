import { useLocation, useNavigate } from "react-router-dom";

const CustomerPolicyList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const policies = location.state?.policies;

  const policyArray = Array.isArray(policies) ? policies : [policies];

  const handleRowClick = (policyId) => {
    navigate("/CustomerInfo", { state: { policies: policyId } });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 mt-5">
        Customer Policy List
      </h1>

      {policyArray.length > 0 && policyArray[0] ? (
        <div className="overflow-x-auto rounded-xl shadow-lg mx-auto w-[800px]"> 
          <table className="w-full bg-gray-200 rounded-lg border border-gray-300">
            <thead>
              <tr className="bg-green-800 text-white rounded-t-lg">
                <th className="p-3 pl-6 text-left">ID</th>
                <th className="p-3 text-left">Policy Holder</th>
                <th className="p-3 text-left">Policy Name</th>
                <th className="p-3 text-left">Policy Type</th>
              </tr>
            </thead>
            <tbody>
              {policyArray.map((policy, index) => (
                <tr
                  key={policy.policydetails_uid}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                  } hover:bg-gray-300 cursor-pointer transition duration-200`} 
                  onClick={() => handleRowClick(policy.policydetails_uid)} // ✅ Fixed click handler
                >
                  <td className="p-3 pl-6 text-left">{index + 1}</td>
                  <td className="p-3 text-left">{policy.policy_holder}</td>
                  <td className="p-3 text-left">{policy.policy_type}</td>
                  <td className="p-3 text-left">{policy.policy_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No policies found</p>
      )}
    </div>
  );
};

export default CustomerPolicyList;
