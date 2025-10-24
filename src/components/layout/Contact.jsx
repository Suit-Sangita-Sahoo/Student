import React from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";

const Contact = () => {
  const contactInfo = [
    {
      icon: <FaEnvelope className="text-xl" />,
      label: "Email:",
      value: "Suitsangitasahoo@gmail.com",
    },
    {
      icon: <FaPhone className="text-xl" />,
      label: "Tel:",
      value: "+91 7681027767",
    },
  ];

  return (
    <div className="text-center py-16 px-6 bg-white" id="contact">
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-2 text-gray-800">Get in touch</h2>
      <p className="text-gray-600 mb-12">
        Do you have a project in your mind? Contact me here 👇
      </p>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-10">

        {/* Left Side — Contact Info Card */}
        <div className="relative w-[450px] h-[250px] p-8 text-left rounded-xl shadow-lg overflow-hidden group cursor-pointer transition-all duration-300">
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-[#46d2d2] h-0 group-hover:h-full transition-all duration-300 rounded-xl z-0"></div>

          <div className="relative z-10">
            <h3 className="text-xl font-semibold mb-4 transition-colors duration-300 group-hover:text-white">
              Find Me ↩
            </h3>
            {contactInfo.map((item, index) => (
              <p
                key={index}
                className="flex items-center gap-3 text-gray-800 mb-3 transition-colors duration-300 group-hover:text-white"
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {item.value}
              </p>
            ))}
          </div>
        </div>

        {/* Right Side — Contact Form */}
        <form className="flex flex-col w-[450px] h-[250px] gap-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#46d2d2]"
            />
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#46d2d2]"
            />
          </div>

          <textarea
            id="text"
            placeholder="Message"
            rows="5"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#46d2d2]"
          ></textarea>

          <button
            type="submit"
            className="mt-2 bg-[#46d2d2] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#34a8a8] transition duration-300 self-center"
          >
            Send ✈
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
