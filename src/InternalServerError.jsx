import React from "react";

const InternalServerError = () => {
  const params = new URLSearchParams(window.location.search);
  const userAuthenticated = params.get("Authenticated");
  const agentAuthenticated = params.get("agentAuthenticated");
  const adminAuthenticated = params.get("adminAuthenticated");

  const handleGoHome = () => {
    if (userAuthenticated) {
      window.location.href = "/";
    } else if (agentAuthenticated) {
      window.location.href = "/Agent_home/DashboardGraph";
    } else if (adminAuthenticated) {
      window.location.href = "/Admin_home/DashboardGraph";
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-white font-['Arvo']">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="text-center w-4/5 mx-auto">
            {/* Background Image */}
            <div
              className="relative h-[400px] bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://cdn.dribbble.com/userupload/21469209/file/original-8c965a1035faffb76090e341aaec34ca.gif')",
              }}
            ></div>
            {/* Text Section */}
            <div className="mt-[-0px]">
              <h3 className="text-[24px] font-bold text-black">
                Oops! Internal Server Error
              </h3>
              <p className="text-[18px] text-gray-700">
                Something went wrong on our end. Please try again later.
              </p>
              {/* Button */}
              <button
                onClick={handleGoHome}
                className="mt-5 inline-block px-6 py-3 text-white bg-[#39ac31] rounded-lg text-[20px] font-semibold hover:bg-[#2d8e27] transition-all duration-300"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InternalServerError;
