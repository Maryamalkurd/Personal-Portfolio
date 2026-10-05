import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API = "http://localhost:5000/api";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projectForm, setProjectForm] = useState({ title: "", description: "", image_url: "", project_url: "", category: "first" });
  const [skillForm, setSkillForm] = useState({ name: "", percentage: "" });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/admin");
  };

  const loadData = async () => {
    const p = await fetch(`${API}/projects`).then(r => r.json());
    const s = await fetch(`${API}/skills`).then(r => r.json());
    setProjects(p);
    setSkills(s);
  };

// useEffect(() => {
//   loadData();

//   // امسح الجلسة لما تطلعي من هاي الصفحة
//   return () => {
//     sessionStorage.removeItem("token");
//   };
//     }, []);
useEffect(() => { loadData(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`${API}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.status === 401) return handleLogout();
      const data = await res.json();
      setProjectForm(prev => ({ ...prev, image_url: data.url }));
    } catch (err) {
      alert("Image upload failed");
    }
    setUploading(false);
  };

  const submitProject = async (e) => {
    e.preventDefault();
    const url = editingId ? `${API}/projects/${editingId}` : `${API}/projects`;
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: authHeaders, body: JSON.stringify(projectForm) });
    if (res.status === 401) return handleLogout();
    setProjectForm({ title: "", description: "", image_url: "", project_url: "", category: "first" });
    setEditingId(null);
    loadData();
  };

  const editProject = (p) => { setProjectForm(p); setEditingId(p.id); setTab("projects"); };

  const deleteProject = async (id) => {
    const res = await fetch(`${API}/projects/${id}`, { method: "DELETE", headers: authHeaders });
    if (res.status === 401) return handleLogout();
    loadData();
  };

  const submitSkill = async (e) => {
    e.preventDefault();
    const url = editingId ? `${API}/skills/${editingId}` : `${API}/skills`;
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: authHeaders, body: JSON.stringify(skillForm) });
    if (res.status === 401) return handleLogout();
    setSkillForm({ name: "", percentage: "" });
    setEditingId(null);
    loadData();
  };

  const editSkill = (s) => { setSkillForm(s); setEditingId(s.id); setTab("skills"); };

  const deleteSkill = async (id) => {
    const res = await fetch(`${API}/skills/${id}`, { method: "DELETE", headers: authHeaders });
    if (res.status === 401) return handleLogout();
    loadData();
  };

  const categoryLabel = (cat) => cat === "first" ? "Tab 1" : cat === "second" ? "Tab 2" : "Tab 3";

  return (
    <div className="admin-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <h1 className="admin-title">Admin Dashboard</h1>
        <button className="submit-btn" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="admin-tabs">
        <button className={`tab-btn ${tab === "projects" ? "active" : ""}`} onClick={() => { setTab("projects"); setEditingId(null); }}>
          Projects ({projects.length})
        </button>
        <button className={`tab-btn ${tab === "skills" ? "active" : ""}`} onClick={() => { setTab("skills"); setEditingId(null); }}>
          Skills ({skills.length})
        </button>
      </div>

      {tab === "projects" && (
        <>
          <div className="admin-card">
            <form className="admin-form" onSubmit={submitProject}>
              <label>Project Title</label>
              <input placeholder="e.g. Business Startup" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required />

              <label>Description</label>
              <textarea placeholder="Short description" rows={3} value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />

              <label>Project Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {uploading && <p style={{ color: "#AA367C" }}>Uploading...</p>}
              {projectForm.image_url && (
                <img className="image-preview" src={`http://localhost:5000${projectForm.image_url}`} alt="preview" />
              )}

              <label>Project Link (optional)</label>
              <input placeholder="https://..." value={projectForm.project_url} onChange={e => setProjectForm({ ...projectForm, project_url: e.target.value })} />

              <label>Category</label>
              <select value={projectForm.category} onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}>
                <option value="first">Tab 1</option>
                <option value="second">Tab 2</option>
                <option value="third">Tab 3</option>
              </select>

              <button type="submit" className="submit-btn">
                {editingId ? "Update Project" : "Submit Project"}
              </button>
            </form>
          </div>

          <div className="item-list">
            {projects.length === 0 && <p className="empty-msg">No projects added yet.</p>}
            {projects.map(p => (
              <div className="item-row" key={p.id}>
                <div className="item-info">
                  <strong>{p.title}</strong>
                  <span>{categoryLabel(p.category)}</span>
                </div>
                <div className="item-actions">
                  <button className="edit-btn" onClick={() => editProject(p)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteProject(p.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "skills" && (
        <>
          <div className="admin-card">
            <form className="admin-form" onSubmit={submitSkill}>
              <label>Skill Name</label>
              <input placeholder="e.g. Node.js" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} required />

              <label>Percentage (0–100)</label>
              <input type="number" min="0" max="100" placeholder="e.g. 85" value={skillForm.percentage} onChange={e => setSkillForm({ ...skillForm, percentage: e.target.value })} required />

              <button type="submit" className="submit-btn">
                {editingId ? "Update Skill" : "Submit Skill"}
              </button>
            </form>
          </div>

          <div className="item-list">
            {skills.length === 0 && <p className="empty-msg">No skills added yet.</p>}
            {skills.map(s => (
              <div className="item-row" key={s.id}>
                <div className="item-info">
                  <strong>{s.name}</strong>
                  <span>{s.percentage}%</span>
                </div>
                <div className="item-actions">
                  <button className="edit-btn" onClick={() => editSkill(s)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteSkill(s.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};