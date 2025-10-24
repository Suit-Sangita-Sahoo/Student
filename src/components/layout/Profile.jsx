import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../CreateContext/GlobalContext";

const emptyQualification = { degree: "", description: "" };
const emptyProject = { title: "", description: "" };

const Profile = () => {
  const { current_user, setCurrentUser, setLoginStatus } = useContext(AuthContext);
  const { id: paramId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // user fetched/stored state
  const [user, setUser] = useState(current_user || state || null);
  const [loading, setLoading] = useState(false);

  // UI mode: 'view' | 'edit_basic' | 'edit_skill' | 'add_skill' | 'edit_qualification' | 'add_qualification' | 'edit_project' | 'add_project'
  const [mode, setMode] = useState("view");

  // local editable copies (so edits don't immediately overwrite user until saved)
  const [basicForm, setBasicForm] = useState({
    teachername: "",
    email: "",
    password: "",
    age: "",
    phone: ""
  });
  const [skillsForm, setSkillsForm] = useState([]); // array of strings
  const [qualificationForm, setQualificationForm] = useState([{ ...emptyQualification }]);
  const [projectForm, setProjectForm] = useState([{ ...emptyProject }]);

  
  const userId =
    paramId ||
    state?.id ||
    current_user?.id ||
    JSON.parse(localStorage.getItem("current_user"))?.id;

  
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:3004/teachers/${userId}`);
        setUser(data);
        setCurrentUser && setCurrentUser(data);
        localStorage.setItem("current_user", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching user:", err);
        toast.error("Unable to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // whenever user changes, update all local forms so editing starts from latest data
  useEffect(() => {
    if (!user) return;
    setBasicForm({
      teachername: user.teachername || "",
      email: user.email || "",
      password: user.password || "",
      age: user.age || "",
      phone: user.phone || ""
    });

    
    const skills = Array.isArray(user.Skill)
      ? user.Skill
      : user.Skill
      ? [user.Skill]
      : [];
    setSkillsForm(skills);

    // Normalize qualifications as array of {degree,description}
    const qualifications = Array.isArray(user.qualification)
      ? user.qualification
      : user.qualification
      ? (function () {
          try {
            const parsed = JSON.parse(user.qualification);
            return Array.isArray(parsed) ? parsed : [{ degree: user.qualification, description: "" }];
          } catch {
            return [{ degree: user.qualification, description: "" }];
          }
        })()
      : [{ ...emptyQualification }];
    setQualificationForm(qualifications.length ? qualifications : [{ ...emptyQualification }]);

    // Normalize projects
    const projects = Array.isArray(user.project)
      ? user.project
      : user.project
      ? (function () {
          try {
            const parsed = JSON.parse(user.project);
            return Array.isArray(parsed) ? parsed : [{ title: user.project, description: "" }];
          } catch {
            return [{ title: user.project, description: "" }];
          }
        })()
      : [{ ...emptyProject }];
    setProjectForm(projects.length ? projects : [{ ...emptyProject }]);
  }, [user]);

  // helper: apply update to server and local user state
  const saveToServer = async (updatedFields) => {
    if (!userId) {
      toast.error("Invalid user ID");
      return null;
    }
    try {
      const payload = { ...user, ...updatedFields };
      const { data } = await axios.put(`http://localhost:3004/teachers/${userId}`, payload);
      setUser(data);
      setCurrentUser && setCurrentUser(data);
      localStorage.setItem("current_user", JSON.stringify(data));
      toast.success("Saved successfully");
      return data;
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Unable to save changes");
      return null;
    }
  };

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicForm((s) => ({ ...s, [name]: value }));
  };
  const handleSaveBasic = async (e) => {
    e.preventDefault();
    // optional validation
    if (!basicForm.teachername || !basicForm.email) {
      toast.error("Name and email are required");
      return;
    }
    await saveToServer(basicForm);
    setMode("view");
  };

  // SKILLS
  const addSkillLocal = () => setSkillsForm((s) => [...s, ""]);
  const updateSkillLocal = (idx, val) => setSkillsForm((s) => s.map((x, i) => (i === idx ? val : x)));
  const removeSkillLocal = (idx) => setSkillsForm((s) => s.filter((_, i) => i !== idx));
  const handleSaveSkills = async (e) => {
    e.preventDefault();
    // Save array as Skill
    await saveToServer({ Skill: skillsForm });
    setMode("view");
  };

  // QUALIFICATIONS
  const addQualificationLocal = () => setQualificationForm((q) => [...q, { ...emptyQualification }]);
  const updateQualificationLocal = (idx, field, val) =>
    setQualificationForm((q) => q.map((it, i) => (i === idx ? { ...it, [field]: val } : it)));
  const removeQualificationLocal = (idx) => setQualificationForm((q) => q.filter((_, i) => i !== idx));
  const handleSaveQualifications = async (e) => {
    e.preventDefault();
    await saveToServer({ qualification: qualificationForm });
    setMode("view");
  };

  // PROJECTS
  const addProjectLocal = () => setProjectForm((p) => [...p, { ...emptyProject }]);
  const updateProjectLocal = (idx, field, val) => setProjectForm((p) => p.map((it, i) => (i === idx ? { ...it, [field]: val } : it)));
  const removeProjectLocal = (idx) => setProjectForm((p) => p.filter((_, i) => i !== idx));
  const handleSaveProjects = async (e) => {
    e.preventDefault();
    await saveToServer({ project: projectForm });
    setMode("view");
  };

  // Delete
  const handleDelete = async () => {
    if (!userId) return toast.error("Invalid user");
    try {
      await axios.delete(`http://localhost:3004/teachers/${userId}`);
      localStorage.removeItem("authtoken");
      localStorage.removeItem("current_user");
      setCurrentUser && setCurrentUser(null);
      setLoginStatus && setLoginStatus(false);
      toast.success("Profile deleted");
      navigate("/home");
    } catch (err) {
      console.error(err);
      toast.error("Unable to delete");
    }
  };

  /* ---------- Render helpers ---------- */

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">No user found</div>;

  const firstLetter = user.teachername?.[0]?.toUpperCase() || "";

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
              {firstLetter}
            </div>
            <div className="mt-3 text-center">
              <div className="font-semibold">{user.teachername}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setMode("view")}
              className={`w-full text-left px-3 py-2 rounded ${mode === "view" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
              View Profile
            </button>

            <button
              onClick={() => setMode("edit_basic")}
              className={`w-full text-left px-3 py-2 rounded ${mode === "edit_basic" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
               Edit Basic Info
            </button>

            <button
              onClick={() => setMode("edit_skill")}
              className={`w-full text-left px-3 py-2 rounded ${mode === "edit_skill" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
               Edit Skills
            </button>

            <button
              onClick={() => { setMode("add_skill"); setSkillsForm((s) => s); }}
              className={`w-full text-left px-3 py-2 rounded ${mode === "add_skill" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
               Add Skill
            </button>

            <button
              onClick={() => setMode("edit_qualification")}
              className={`w-full text-left px-3 py-2 rounded ${mode === "edit_qualification" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
               Edit Qualifications
            </button>

            <button
              onClick={() => setMode("add_qualification")}
              className={`w-full text-left px-3 py-2 rounded ${mode === "add_qualification" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
               Add Qualification
            </button>

            <button
              onClick={() => setMode("edit_project")}
              className={`w-full text-left px-3 py-2 rounded ${mode === "edit_project" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
               Edit Projects
            </button>

            <button
              onClick={() => setMode("add_project")}
              className={`w-full text-left px-3 py-2 rounded ${mode === "add_project" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
               Add Project
            </button>
          </div>
        </div>

        <div>
          <button onClick={handleDelete} className="w-full bg-red-500 text-white py-2 rounded">
            🗑️ Delete Profile
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Profile Dashboard</h1>

        {/* VIEW MODE */}
        {mode === "view" && (
          <>
            <section className="bg-white p-6 rounded shadow mb-6">
              <h2 className="text-lg font-semibold mb-3">Basic Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="font-medium">Name:</span> {user.teachername}</div>
                <div><span className="font-medium">Email:</span> {user.email}</div>
                <div><span className="font-medium">Age:</span> {user.age}</div>
                <div><span className="font-medium">Phone:</span> {user.phone}</div>
              </div>
            </section>

            <section className="bg-white p-6 rounded shadow mb-6">
              <h2 className="text-lg font-semibold mb-3">Skills</h2>
              {skillsForm.length ? (
                <ul className="list-disc ml-6 space-y-1">{skillsForm.map((s, i) => <li key={i}>{s}</li>)}</ul>
              ) : (
                <div className="text-gray-500">No skills yet.</div>
              )}
            </section>

            <section className="bg-white p-6 rounded shadow mb-6">
              <h2 className="text-lg font-semibold mb-3">Qualifications</h2>
              {qualificationForm.length ? (
                <ul className="list-disc ml-6 space-y-1">
                  {qualificationForm.map((q, i) => (
                    <li key={i}>
                      {q.degree} {q.description && `- ${q.description}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">No qualifications yet.</div>
              )}
            </section>

            <section className="bg-white p-6 rounded shadow">
              <h2 className="text-lg font-semibold mb-3">Projects</h2>
              {projectForm.length ? (
                <ul className="list-disc ml-6 space-y-1">
                  {projectForm.map((p, i) => (
                    <li key={i}>
                      {p.title} {p.description && `- ${p.description}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">No projects yet.</div>
              )}
            </section>
          </>
        )}

        {/* EDIT BASIC */}
        {mode === "edit_basic" && (
          <section className="bg-white p-6 rounded shadow max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">Edit Basic Information</h2>
            <form onSubmit={handleSaveBasic} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input name="teachername" value={basicForm.teachername} onChange={handleBasicChange} className="mt-1 block w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input name="email" value={basicForm.email} onChange={handleBasicChange} className="mt-1 block w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input type="password" name="password" value={basicForm.password} onChange={handleBasicChange} className="mt-1 block w-full border rounded p-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Age</label>
                  <input name="age" value={basicForm.age} onChange={handleBasicChange} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Phone</label>
                  <input name="phone" value={basicForm.phone} onChange={handleBasicChange} className="mt-1 block w-full border rounded p-2" />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                <button type="button" onClick={() => setMode("view")} className="px-4 py-2 border rounded">Cancel</button>
              </div>
            </form>
          </section>
        )}

        {/* EDIT/ADD SKILLS */}
        {(mode === "edit_skill" || mode === "add_skill") && (
          <section className="bg-white p-6 rounded shadow max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">{mode === "add_skill" ? "Add Skill" : "Edit Skills"}</h2>

            <form onSubmit={handleSaveSkills} className="space-y-3">
              {skillsForm.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input value={s} onChange={(e) => updateSkillLocal(i, e.target.value)} className="flex-1 border rounded p-2" />
                  <button type="button" onClick={() => removeSkillLocal(i)} className="bg-red-500 text-white px-3 rounded">X</button>
                </div>
              ))}

              <div className="flex gap-2">
                <button type="button" onClick={addSkillLocal} className="bg-green-600 text-white px-3 py-2 rounded">Add Row</button>
                <div className="flex-1" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Skills</button>
              </div>
            </form>
          </section>
        )}

        {/* EDIT/ADD QUALIFICATIONS */}
        {(mode === "edit_qualification" || mode === "add_qualification") && (
          <section className="bg-white p-6 rounded shadow max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">{mode === "add_qualification" ? "Add Qualification" : "Edit Qualifications"}</h2>

            <form onSubmit={handleSaveQualifications} className="space-y-3">
              {qualificationForm.map((q, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 items-center">
                  <input placeholder="Degree" value={q.degree} onChange={(e) => updateQualificationLocal(i, "degree", e.target.value)} className="border rounded p-2" />
                  <div className="flex gap-2">
                    <input placeholder="Description" value={q.description} onChange={(e) => updateQualificationLocal(i, "description", e.target.value)} className="flex-1 border rounded p-2" />
                    <button type="button" onClick={() => removeQualificationLocal(i)} className="bg-red-500 text-white px-3 rounded">X</button>
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <button type="button" onClick={addQualificationLocal} className="bg-green-600 text-white px-3 py-2 rounded">Add Row</button>
                <div className="flex-1" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Qualifications</button>
              </div>
            </form>
          </section>
        )}

        {/* EDIT/ADD PROJECTS */}
        {(mode === "edit_project" || mode === "add_project") && (
          <section className="bg-white p-6 rounded shadow max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">{mode === "add_project" ? "Add Project" : "Edit Projects"}</h2>

            <form onSubmit={handleSaveProjects} className="space-y-3">
              {projectForm.map((p, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 items-center">
                  <input placeholder="Title" value={p.title} onChange={(e) => updateProjectLocal(i, "title", e.target.value)} className="border rounded p-2" />
                  <div className="flex gap-2">
                    <input placeholder="Description" value={p.description} onChange={(e) => updateProjectLocal(i, "description", e.target.value)} className="flex-1 border rounded p-2" />
                    <button type="button" onClick={() => removeProjectLocal(i)} className="bg-red-500 text-white px-3 rounded">X</button>
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <button type="button" onClick={addProjectLocal} className="bg-green-600 text-white px-3 py-2 rounded">Add Row</button>
                <div className="flex-1" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Projects</button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default Profile;
