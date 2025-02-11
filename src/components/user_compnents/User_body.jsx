import React from "react"
import insuranceImage from "../../assets/3979003.png"
import lifeinsurance from "../../assets/Life_Insurance.jpg"
import homeinsurance from "../../assets/homeinsurance.jpg"
import autoinsurance from "../../assets/autoinsurance.jpg"


// Reusable PolicyCard Component
const PolicyCard = ({ image, title, description }) => (
  <div className="max-w-sm overflow-hidden bg-white rounded-lg shadow-md">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
)

// Reusable StatsCard Component for the Statistics Section
const StatsCard = ({ count, label }) => (
  <div className="bg-[#0D5835] p-6 rounded-lg transform transition-all duration-300 hover:scale-105">
    <div className="text-4xl font-bold text-white mb-2">{count}</div>
    <div className="text-gray-300 uppercase text-sm">{label}</div>
  </div>
)

const User_body = () => {
  const policies = [
    {
      image: lifeinsurance,
      title: "Life Insurance",
      description:
        "Ensure your family's future with life insurance that provides financial security and peace of mind during life’s uncertainties.",
    },
    {
      image: homeinsurance,
      title: "Home Insurance",
      description:
        "Protect your home and belongings from fire, theft, and disasters with comprehensive coverage for peace of mind.",
    },
    {
      image: autoinsurance,
      title: "Auto Insurance",
      description:
        "Stay protected on the road with auto insurance covering accidents, theft, and damage, giving you financial security wherever you drive.",
    },
  ]

  return (
    <main
      className="py-12 px-6 overflow-hidden"
      style={{ backgroundColor: "#0D4A31" }}
    >
      {/* Hero Section */}
      <section className="relative bg-[#0B4B2] min-h-screen">
        <div className="container mx-auto px-6 pt-32 pb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-white space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                Are You Covered?
                <br />
                Home, Life, &<br />
                Auto Insurance.
              </h1>
              <p className="text-gray-300 max-w-lg">
              Life is unpredictable, but with the right coverage, you can rest assured knowing you're protected. 
              Whether it's your home, your family's future, or your vehicle, our comprehensive insurance plans are 
              designed to provide peace of mind in every aspect of your life. We offer tailored solutions to ensure 
              you're fully covered, no matter the situation. Don't wait for the unexpected—ensure your security today 
              with our trusted insurance options for home, life, and auto.
              </p>
              <div className="flex space-x-4">
                <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors">
                  GET STARTED
                </button>
                <button className="text-white border border-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                  WATCH THE VIDEO
                </button>
              </div>
            </div>

            {/* Image Content */}
            <div className="hidden md:block">
              <img
                src={insuranceImage}
                alt="Happy couple with insurance coverage"
                className="object-contain w-[90%] h-[auto] absolute top-[-180px] right-[-50px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Policy Cards Section */}
      <section className="bg-[#0B4B2C] py-20 pl-15">
        <div className="container mx-auto px-6">
          <h2 className="text-white text-3xl font-bold mb-12">
            Individual & Umbrella Policies
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {policies.map((policy, index) => (
              <PolicyCard
                key={index}
                image={policy.image}
                title={policy.title}
                description={policy.description}
              />
            ))}
          </div>
          <div className="text-center">
            <button className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors">
              BROWSE ALL POLICIES
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-[#0B4B2C] py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h2 className="text-3xl font-bold">
                Experienced Agents
                <br />
                You Can Trust
              </h2>
              <p className="max-w-lg">
              Our team of highly skilled agents is dedicated to providing you with exceptional service and expert guidance. 
              With years of experience in the industry, we understand the intricacies of the market and are committed to 
              delivering results that exceed your expectations. Whether you're buying, selling, or seeking advice, you can 
              rely on us to be with you every step of the way, ensuring your peace of mind throughout the process.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <StatsCard count="18" label="POLICIES" />
              <StatsCard count="9" label="AGENTS" />
              <StatsCard count="10" label="YEARS IN BUSINESS" />
              <StatsCard count="100,000" label="CUSTOMER" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default User_body
