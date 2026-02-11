import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "./apiClient";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", category: "", tags: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    const url = "/api/projects";
    console.log("[Projects] GET", url);
    try {
      const res = await fetch(url);
      console.log("[Projects] GET status", res.status);
      if (!res.ok) {
        const body = await res.text();
        console.error("[Projects] GET failed", { url, status: res.status, body });
        setError(`Failed to load projects (HTTP ${res.status})`);
        setProjects([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load projects");
      setProjects([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    setError("");
    const url = "/api/projects";
    const payload = {
      name: form.name,
      category: form.category || undefined,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
    };
    console.log("[Projects] POST", url, payload);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("[Projects] POST status", res.status);
      if (!res.ok) {
        const body = await res.text();
        console.error("[Projects] POST failed", { url, status: res.status, body });
        setError(`Failed to create project (HTTP ${res.status})`);
        setSubmitting(false);
        return;
      }
      await res.json();
      setForm({ name: "", category: "", tags: "" });
      await fetchProjects();
    } catch (err) {
      setError(err.message || "Failed to create project");
    }
    setSubmitting(false);
  };

  return (
    <section>
      <h2>Projects</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input
          name="name"
          placeholder="Project name *"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
        />
        <button type="submit" disabled={submitting || !form.name.trim()}>
          {submitting ? "Adding..." : "Add Project"}
        </button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <strong>{project.name}</strong> | Status: {project.status || "-"} | Category: {project.category || "-"} | Tags: {Array.isArray(project.tags) ? project.tags.join(", ") : "-"}
            </li>
          ))}
        </ul>
      ) : (
        <div>No projects yet</div>
      )}
    </section>
  );
}
