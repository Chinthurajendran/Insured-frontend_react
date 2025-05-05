import React from "react";

const NotFoundPage = () => {
    const params = new URLSearchParams(window.location.search);
    const userAuthenticated = params.get("Authenticated");
    const agentAuthenticated = params.get("agentAuthenticated");
    const adminAuthenticated = params.get("adminAuthenticated");
    console.log("agentAuthenticated", agentAuthenticated);
  
    const handleGoHome = () => {
      if (userAuthenticated) {
        window.location.href = "/";
      } else if (agent) {
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
            <div className="relative h-[400px] bg-center bg-no-repeat" style={{ backgroundImage: "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')" }}>
              <h1 className="absolute inset-0 flex items-center justify-center text-[80px] font-bold pb-90">404</h1>
            </div>
            {/* Text Section */}
            <div className="mt-[-0px]">
              <h3 className="text-[24px] font-bold text-black">Look like you're lost</h3>
              <p className="text-[18px] text-gray-700">The page you are looking for is not available!</p>
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

export default NotFoundPage;
