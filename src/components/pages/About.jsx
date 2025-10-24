import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("current_user"));
        if (!currentUser?.id) return;

        const { data } = await axios.get(`http://localhost:3004/teachers/${currentUser.id}`);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Unable to load user data");
      }
    };
    fetchCurrentUser();
  }, []);

  if (!user) {
    return <div className="text-center mt-20 text-gray-700">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center">
      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mb-6 flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
          {user.teachername?.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold">{user.teachername}</h1>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-600">Age: {user.age}</p>
        {user.phone && <p className="text-gray-600">Phone: {user.phone}</p>}
      </div>

      {/* Skills Card */}
      <div className="flex gap-[100px]">
      {user.Skill?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mb-6">
          <h2 className="text-xl font-bold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {user.Skill.map((s, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Qualifications Card */}
      {user.qualification?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mb-6">
          <h2 className="text-xl font-bold mb-3">Qualifications</h2>
          <ul className="space-y-2">
            {user.qualification.map((q, idx) => (
              <li
                key={idx}
                className="border-l-4 border-blue-500 pl-3 bg-blue-50 p-2 rounded-md"
              >
                <p className="font-semibold">{q.degree}</p>
                {q.description && <p className="text-gray-600 text-sm">{q.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
       </div>
      {/* Projects Card - Updated to Project.jsx style */}
      {user.project?.length > 0 && (
        <div className="w-full max-w-6xl">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
            My Projects
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {user.project.map((p, idx) => (
              <div
                key={idx}
                className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Optional Image */}
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-52 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-800">{p.title}</h2>
                  <p className="text-gray-600 mb-4">{p.description}</p>

                  {/* Tech tags if present */}
                  {p.tech?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.tech.map((tech, i) => (
                        <span
                          key={i}
                          className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Optional View Project link */}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      View Project
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
