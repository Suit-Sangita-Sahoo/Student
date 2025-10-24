import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    teachername: "",
    email: "",
    password: "",
    age: "",
    phone: "",
    Skill: [],
    qualification: [{ degree: "", description: "" }],
    project: [{ title: "", description: "" }]
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const addSkill = () => setFormData({ ...formData, Skill: [...formData.Skill, ""] });
  const updateSkill = (index, value) => {
    const newSkills = [...formData.Skill];
    newSkills[index] = value;
    setFormData({ ...formData, Skill: newSkills });
  };
  const removeSkill = (index) => {
    const newSkills = [...formData.Skill];
    newSkills.splice(index, 1);
    setFormData({ ...formData, Skill: newSkills });
  };


  const addQualification = () =>
    setFormData({
      ...formData,
      qualification: [...formData.qualification, { degree: "", description: "" }]
    });
  const updateQualification = (index, field, value) => {
    const newQual = [...formData.qualification];
    newQual[index][field] = value;
    setFormData({ ...formData, qualification: newQual });
  };
  const removeQualification = (index) => {
    const newQual = [...formData.qualification];
    newQual.splice(index, 1);
    setFormData({ ...formData, qualification: newQual });
  };

  
  const addProject = () =>
    setFormData({ ...formData, project: [...formData.project, { title: "", description: "" }] });
  const updateProject = (index, field, value) => {
    const newProj = [...formData.project];
    newProj[index][field] = value;
    setFormData({ ...formData, project: newProj });
  };
  const removeProject = (index) => {
    const newProj = [...formData.project];
    newProj.splice(index, 1);
    setFormData({ ...formData, project: newProj });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.teachername || !formData.email || !formData.password || !formData.age) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3004/teachers", formData);
      toast.success("Registration Successful ✅");
      setFormData({
        teachername: "",
        email: "",
        password: "",
        age: "",
        phone: "",
        Skill: [],
        qualification: [{ degree: "", description: "" }],
        project: [{ title: "", description: "" }]
      });
      navigate("/root/login");
    } catch (err) {
      console.error(err);
      toast.error("Server error, please try again");
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-blue-400 rounded-xl p-6 space-y-4">
        <h2 className="text-center font-bold text-xl mb-4">Create Account</h2>

        <label>
          Teacher Name
          <input type="text" name="teachername" value={formData.teachername} onChange={handleChange} className="w-full rounded p-1" />
        </label>
        <label>
          Email
          <input type="text" name="email" value={formData.email} onChange={handleChange} className="w-full rounded p-1" />
        </label>
        <label>
          Password
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full rounded p-1" />
        </label>
        <label>
          Age
          <input type="text" name="age" value={formData.age} onChange={handleChange} className="w-full rounded p-1" />
        </label>
        <label>
          Phone
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded p-1" />
        </label>

      
        <div>
          <h3 className="font-semibold">Skills</h3>
          {formData.Skill.map((s, i) => (
            <div key={i} className="flex gap-2 mt-1">
              <input
                type="text"
                value={s}
                onChange={(e) => updateSkill(i, e.target.value)}
                className="flex-1 rounded p-1"
              />
              <button type="button" onClick={() => removeSkill(i)} className="bg-red-500 text-white px-2 rounded">X</button>
            </div>
          ))}
          <button type="button" onClick={addSkill} className="mt-1 bg-green-600 text-white px-2 rounded">Add Skill</button>
        </div>

      
        <div>
          <h3 className="font-semibold">Qualifications</h3>
          {formData.qualification.map((q, i) => (
            <div key={i} className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Degree"
                value={q.degree}
                onChange={(e) => updateQualification(i, "degree", e.target.value)}
                className="flex-1 rounded p-1"
              />
              <input
                type="text"
                placeholder="Stream"
                value={q.description}
                onChange={(e) => updateQualification(i, "description", e.target.value)}
                className="flex-1 rounded p-1"
              />
              <button type="button" onClick={() => removeQualification(i)} className="bg-red-500 text-white px-2 rounded">X</button>
            </div>
          ))}
          <button type="button" onClick={addQualification} className="mt-1 bg-green-600 text-white px-2 rounded">Add Qualification</button>
        </div>

        {/* Projects */}
        <div>
          <h3 className="font-semibold">Projects</h3>
          {formData.project.map((p, i) => (
            <div key={i} className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Project Title"
                value={p.title}
                onChange={(e) => updateProject(i, "title", e.target.value)}
                className="flex-1 rounded p-1"
              />
              <input
                type="text"
                placeholder="Description"
                value={p.description}
                onChange={(e) => updateProject(i, "description", e.target.value)}
                className="flex-1 rounded p-1"
              />
              <button type="button" onClick={() => removeProject(i)} className="bg-red-500 text-white px-2 rounded">X</button>
            </div>
          ))}
          <button type="button" onClick={addProject} className="mt-1 bg-green-600 text-white px-2 rounded">Add Project</button>
        </div>

        <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded mt-4">Register</button>
      </form>
    </div>
  );
};

export default Signup;
