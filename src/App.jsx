import { useState, useRef, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// ─── Data ────────────────────────────────────────────────────────────────────

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: "ShopFlow",
    subtitle: "Full-Stack E-Commerce Platform",
    desc: "A complete e-commerce application with customer shopping, cart management, and a real-time admin dashboard. Features product browsing with category filters, order tracking, live feed updates, and full admin controls for managing orders and inventory.",
    features: [
      "Customer & Admin roles",
      "Cart & Checkout flow",
      "Real-time order tracking",
      "Live order feed",
    ],
    tags: ["JavaScript", "HTML", "CSS", "Node.js"],
    status: "Completed",
    github: "#",
    image: null,
  },
  {
    id: 2,
    title: "Mini Project in Java",
    subtitle: "Console-Based Shopping List App",
    desc: "A Java console application implementing a full shopping list manager. Built using OOP principles with a menu-driven interface to add items, count entries, display the full list, and search for specific items — demonstrating core Java fundamentals.",
    features: [
      "Add & display items",
      "Count entries",
      "Item search",
      "Menu-driven UI",
    ],
    tags: ["Java", "OOP", "Scanner", "Collections"],
    status: "Completed",
    github: "#",
    image: null,
  },
];

const SKILLS = [
  { icon: "⚙️", name: "C", tags: ["Pointers", "Memory Management", "Structs"] },
  { icon: "🔧", name: "C++", tags: ["OOP", "STL", "Templates"] },
  { icon: "☕", name: "Java", tags: ["Core Java", "OOP", "Collections", "JDBC", "Multithreading"] },
  { icon: "🐍", name: "Python", tags: ["Scripting", "Basics", "Problem Solving"] },
  { icon: "🎨", name: "HTML & CSS", tags: ["HTML5", "CSS3", "Flexbox", "Responsive Design"] },
  { icon: "⚡", name: "JavaScript", tags: ["ES6+", "DOM", "Fetch API"] },
  { icon: "⚛️", name: "React", tags: ["Hooks", "Components", "JSX", "State Management"] },
  { icon: "🌱", name: "Spring Boot", tags: ["REST APIs", "Spring MVC", "Spring Data JPA"] },
  { icon: "🧩", name: "DSA", tags: ["Arrays", "Linked Lists", "Trees", "Sorting", "Stacks"] },
  { icon: "🗄️", name: "SQL", tags: ["MySQL", "Queries", "Joins"] },
];

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  desc: "",
  features: "",
  tags: "",
  status: "Completed",
  github: "",
  image: null,
};

const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"%3E%3Crect width="120" height="120" fill="%23212b38"/%3E%3Ccircle cx="60" cy="40" r="24" fill="%2354d084"/%3E%3Cpath d="M30 104c0-18 14-32 30-32s30 14 30 32" fill="%2354d084"/%3E%3C/svg%3E';
const OWNER_PASSWORD = import.meta.env.VITE_OWNER_PASSWORD; 

// ─── Styles ──────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green: #4ade80;
    --green-dark: #22c55e;
    --green-dim: #1a3a2a;
    --bg: #0d1117;
    --bg2: #161b22;
    --bg3: #1c2128;
    --border: #30363d;
    --text: #e6edf3;
    --muted: #8b949e;
    --mono: 'Courier New', monospace;
    --font: 'Inter', system-ui, sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font);
    min-height: 100vh;
    scroll-behavior: smooth;
  }

  /* NAV */
  .dk-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 48px; border-bottom: 1px solid var(--border);
    background: var(--bg); position: sticky; top: 0; z-index: 50;
  }
  .dk-logo { font-weight: 800; font-size: 18px; letter-spacing: -0.5px; color: var(--text); }
  .dk-logo span { color: var(--green); }
  .dk-nav-tabs { display: flex; gap: 4px; }
  .dk-nav-tab {
    padding: 6px 16px; border-radius: 6px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; background: transparent; color: var(--muted);
    font-family: var(--font); transition: all .2s;
  }
  .dk-nav-tab:hover { color: var(--text); }
  .dk-nav-tab.active {
    background: var(--bg3); color: var(--text); border: 1px solid var(--border);
  }
  .dk-hire-btn {
    padding: 8px 20px; background: var(--green-dark); color: #0d1117;
    border: none; border-radius: 8px; font-weight: 700; font-size: 13px;
    cursor: pointer; font-family: var(--font); transition: all .2s;
  }
  .dk-hire-btn:hover { background: var(--green); }

  /* PAGE */
  .dk-page { padding: 40px 48px; max-width: 1200px; margin: 0 auto; }

  /* ABOUT */
  .dk-about-grid {
    display: grid; grid-template-columns: 1fr 320px; gap: 40px; align-items: start;
  }
  .dk-avail {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; letter-spacing: 1.5px; color: var(--green);
    margin-bottom: 20px; text-transform: uppercase; font-weight: 600;
  }
  .dk-avail-dot {
    width: 7px; height: 7px; border-radius: 50%; background: var(--green);
    animation: dk-pulse 2s infinite;
  }
  @keyframes dk-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
  .dk-hero-name {
    font-size: 56px; font-weight: 800; line-height: 1.05; margin-bottom: 10px;
  }
  .dk-hero-name span { color: var(--green); }
  .dk-hero-role {
    color: var(--green); font-size: 18px; font-weight: 600; margin-bottom: 20px;
  }
  .dk-hero-bio {
    color: var(--muted); font-size: 14px; line-height: 1.85; margin-bottom: 12px;
  }
  .dk-contact-links {
    display: flex; gap: 16px; margin-bottom: 24px;
  }
  .dk-contact-link {
    color: var(--green); text-decoration: none; font-weight: 600;
    font-size: 14px; transition: color .2s;
  }
  .dk-contact-link:hover { color: var(--text); }
  .dk-hero-btns { display: flex; gap: 12px; margin-top: 24px; }
  .dk-btn-green {
    padding: 10px 24px; background: var(--green-dark); color: #0d1117;
    border: none; border-radius: 8px; font-weight: 700; font-size: 14px;
    cursor: pointer; font-family: var(--font); transition: all .2s;
  }
  .dk-btn-green:hover { background: var(--green); }
  .dk-btn-outline {
    padding: 10px 24px; background: transparent; color: var(--text);
    border: 1px solid var(--border); border-radius: 8px; font-weight: 600;
    font-size: 14px; cursor: pointer; font-family: var(--font); transition: all .2s;
  }
  .dk-btn-outline:hover { border-color: var(--green); color: var(--green); }

  /* PROFILE CARD */
  .dk-profile-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 16px; padding: 24px; text-align: center;
  }
  .dk-card-label {
    font-size: 11px; color: var(--muted); text-transform: uppercase;
    letter-spacing: 1px; margin-bottom: 16px;
  }
  .dk-avatar-ring {
    width: 144px; height: 144px; border-radius: 50%;
    border: 3px solid var(--green); padding: 3px;
    margin: 0 auto 16px; position: relative; cursor: pointer;
  }
  .dk-avatar-ring img {
    width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;
  }
  .dk-avatar-overlay {
    position: absolute; inset: 3px; border-radius: 50%;
    background: rgba(0,0,0,.65); display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 4px;
    opacity: 0; transition: .2s;
  }
  .dk-avatar-ring:hover .dk-avatar-overlay { opacity: 1; }
  .dk-avatar-overlay span { font-size: 11px; color: #fff; font-weight: 600; }
  .dk-profile-name { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
  .dk-profile-role { font-size: 12px; color: var(--green); }
  .dk-stats-row { display: flex; justify-content: center; gap: 28px; margin-top: 18px; }
  .dk-stat-num { font-size: 24px; font-weight: 800; color: var(--green); }
  .dk-stat-lbl { font-size: 11px; color: var(--muted); }

  /* PROJECTS */
  .dk-section-header { margin-bottom: 12px; }
  .dk-section-header h2 { font-size: 36px; font-weight: 800; }
  .dk-section-header p { color: var(--muted); font-size: 14px; margin-top: 6px; }
  .dk-add-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 22px; background: var(--green-dark); color: #0d1117;
    border: none; border-radius: 8px; font-weight: 700; font-size: 14px;
    cursor: pointer; font-family: var(--font); margin: 20px 0 32px;
    transition: all .2s;
  }
  .dk-add-btn:hover { background: var(--green); }

  .dk-project-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0 32px;
  }
  .dk-data-actions {
    display: flex;
    gap: 12px;
  }
  .dk-export-btn, .dk-import-btn {
    padding: 8px 16px;
    background: var(--bg3);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all .2s;
    font-family: var(--font);
  }
  .dk-export-btn:hover, .dk-import-btn:hover {
    background: var(--bg2);
    border-color: var(--green);
  }

  .dk-project-entry {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 56px; align-items: center;
    padding: 44px 0; border-bottom: 1px solid var(--border);
  }
  .dk-project-entry:last-child { border-bottom: none; }

  .dk-proj-num { font-size: 12px; color: var(--muted); font-family: var(--mono); margin-bottom: 8px; }
  .dk-proj-status {
    display: inline-block; padding: 3px 14px; border-radius: 999px;
    font-size: 11px; font-weight: 700;
    background: var(--green-dim); color: var(--green); border: 1px solid #2d5a3d;
    margin-bottom: 14px;
  }
  .dk-proj-title { font-size: 30px; font-weight: 800; margin-bottom: 4px; }
  .dk-proj-subtitle {
    color: var(--green); font-size: 14px; font-weight: 500;
    margin-bottom: 14px; font-family: var(--mono);
  }
  .dk-proj-desc { color: var(--muted); font-size: 14px; line-height: 1.85; margin-bottom: 16px; }
  .dk-proj-features {
    display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 16px;
  }
  .dk-feat {
    font-size: 12px; color: var(--muted); font-family: var(--mono);
    display: flex; align-items: center; gap: 6px;
  }
  .dk-feat-check { color: var(--green); }
  .dk-proj-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
  .dk-proj-tag {
    padding: 5px 14px; border-radius: 6px; font-size: 12px; font-weight: 600;
    background: transparent; border: 1px solid var(--border); color: var(--text);
  }
  .dk-github-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 24px; background: var(--green-dark); color: #0d1117;
    border: none; border-radius: 8px; font-weight: 700; font-size: 13px;
    cursor: pointer; font-family: var(--font); text-decoration: none;
    transition: all .2s;
  }
  .dk-github-btn:hover { background: var(--green); }
  .dk-proj-actions { display: flex; gap: 8px; margin-top: 12px; }
  .dk-edit-btn, .dk-del-btn {
    padding: 6px 16px; border-radius: 6px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: 1px solid var(--border); background: transparent;
    font-family: var(--font); transition: all .2s;
  }
  .dk-edit-btn { color: var(--green); }
  .dk-edit-btn:hover { border-color: var(--green); background: var(--green-dim); }
  .dk-del-btn { color: #f85149; }
  .dk-del-btn:hover { border-color: #f85149; background: #2a1515; }

  .dk-screenshot {
    width: 100%; border-radius: 12px; border: 1px solid var(--border);
    overflow: hidden; background: var(--bg2);
  }
  .dk-screenshot img { width: 100%; display: block; border-radius: 12px; }
  .dk-screenshot-placeholder {
    height: 280px; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 8px; color: var(--muted); font-size: 13px;
  }

  .dk-empty {
    text-align: center; padding: 60px 20px; color: var(--muted);
    border: 2px dashed var(--border); border-radius: 16px; font-size: 14px;
  }

  /* SKILLS */
  .dk-skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .dk-skill-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px; transition: border-color .2s;
  }
  .dk-skill-card:hover { border-color: var(--green); }
  .dk-skill-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .dk-skill-icon { font-size: 20px; }
  .dk-skill-name { font-size: 15px; font-weight: 700; }
  .dk-skill-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .dk-skill-tag {
    font-size: 11px; padding: 3px 10px; border-radius: 999px;
    background: var(--bg3); color: var(--muted); border: 1px solid var(--border);
  }

  /* MODAL */
  .dk-modal-bg {
    position: fixed; inset: 0; background: rgba(0,0,0,.78);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 16px;
  }
  .dk-modal {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px; width: 100%; max-width: 560px;
    max-height: 90vh; overflow-y: auto;
  }
  .dk-modal h3 { font-size: 18px; font-weight: 800; margin-bottom: 20px; }
  .dk-field { margin-bottom: 16px; }
  .dk-field label {
    display: block; font-size: 11px; color: var(--muted);
    text-transform: uppercase; letter-spacing: .8px;
    font-weight: 600; margin-bottom: 6px;
  }
  .dk-field input, .dk-field textarea, .dk-field select {
    width: 100%; padding: 10px 14px; background: var(--bg3);
    border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); font-size: 14px; font-family: var(--font);
    transition: border .2s; outline: none;
  }
  .dk-field input:focus, .dk-field textarea:focus, .dk-field select:focus {
    border-color: var(--green);
  }
  .dk-field textarea { resize: vertical; min-height: 80px; }
  .dk-field select { cursor: pointer; }
  .dk-field-hint { font-size: 11px; color: var(--muted); margin-top: 4px; }
  .dk-upload-zone {
    width: 100%; min-height: 110px; border: 2px dashed var(--border);
    border-radius: 8px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 6px;
    cursor: pointer; background: var(--bg3); overflow: hidden;
    transition: all .2s;
  }
  .dk-upload-zone:hover { border-color: var(--green); background: var(--green-dim); }
  .dk-upload-zone img { width: 100%; display: block; border-radius: 6px; }
  .dk-upload-label { font-size: 12px; color: var(--muted); }
  .dk-modal-footer { display: flex; gap: 10px; margin-top: 20px; }
  .dk-modal-save {
    flex: 1; padding: 10px; background: var(--green-dark); color: #0d1117;
    border: none; border-radius: 8px; font-weight: 700; font-size: 14px;
    cursor: pointer; font-family: var(--font); transition: all .2s;
  }
  .dk-modal-save:hover { background: var(--green); }
  .dk-modal-cancel {
    flex: 1; padding: 10px; background: transparent; color: var(--muted);
    border: 1px solid var(--border); border-radius: 8px;
    font-size: 14px; cursor: pointer; font-family: var(--font); transition: all .2s;
  }
  .dk-modal-cancel:hover { color: var(--text); border-color: var(--text); }

  /* HIRE MODAL */
  .dk-hire-modal {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 16px; padding: 0; width: 100%; max-width: 800px;
    max-height: 90vh; overflow: hidden; display: flex; flex-direction: column;
  }
  .dk-hire-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 28px; border-bottom: 1px solid var(--border);
  }
  .dk-hire-header h3 { font-size: 20px; font-weight: 800; margin: 0; }
  .dk-modal-close {
    background: none; border: none; font-size: 24px; color: var(--muted);
    cursor: pointer; padding: 0; width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 6px; transition: all .2s;
  }
  .dk-modal-close:hover { background: var(--bg3); color: var(--text); }
  .dk-hire-content {
    padding: 28px; overflow-y: auto; flex: 1;
  }
  .dk-resume-section { margin-bottom: 32px; }
  .dk-resume-section h4 {
    font-size: 16px; font-weight: 700; margin-bottom: 16px;
    color: var(--text);
  }
  .dk-resume-viewer {
    position: relative; border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden; background: var(--bg3);
  }
  .dk-resume-placeholder {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 12px;
    color: var(--muted); text-align: center; padding: 20px;
    background: var(--bg3);
  }
  .dk-resume-placeholder svg { opacity: 0.4; }
  .dk-resume-placeholder p { font-size: 16px; font-weight: 600; margin: 0; }
  .dk-resume-placeholder small { font-size: 12px; opacity: 0.7; }
  .dk-contact-section {
    text-align: center; padding: 24px; background: var(--bg3);
    border-radius: 12px; border: 1px solid var(--border);
  }
  .dk-contact-section h4 {
    font-size: 18px; font-weight: 700; margin-bottom: 8px; color: var(--green);
  }
  .dk-contact-section p {
    color: var(--muted); font-size: 14px; line-height: 1.6; margin-bottom: 20px;
  }
  .dk-contact-actions { display: flex; gap: 12px; justify-content: center; }
  .dk-contact-btn {
    padding: 12px 24px; border-radius: 8px; font-weight: 600;
    font-size: 14px; cursor: pointer; border: none; transition: all .2s;
    font-family: var(--font);
  }
  .dk-contact-email {
    background: var(--green-dark); color: #0d1117;
  }
  .dk-contact-email:hover { background: var(--green); }
  .dk-contact-close {
    background: transparent; color: var(--muted); border: 1px solid var(--border);
  }
  .dk-contact-close:hover { color: var(--text); border-color: var(--text); }

  @media (max-width: 768px) {
    .dk-page { padding: 24px 20px; }
    .dk-about-grid { grid-template-columns: 1fr; }
    .dk-project-entry { grid-template-columns: 1fr; gap: 24px; }
    .dk-skills-grid { grid-template-columns: 1fr 1fr; }
    .dk-hero-name { font-size: 40px; }
    .dk-nav { padding: 12px 20px; }
    .dk-hire-modal { max-width: 95vw; }
    .dk-hire-content { padding: 20px; }
    .dk-contact-actions { flex-direction: column; }
    .dk-project-actions { flex-direction: column; align-items: stretch; gap: 16px; }
    .dk-data-actions { justify-content: center; }
  }
`;

// ─── Components ───────────────────────────────────────────────────────────────

function ScreenshotBox({ image }) {
  if (image) {
    return (
      <div className="dk-screenshot">
        <img src={image} alt="Project screenshot" />
      </div>
    );
  }
  return (
    <div className="dk-screenshot">
      <div className="dk-screenshot-placeholder">
        <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ opacity: 0.3 }}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span>No screenshot uploaded</span>
      </div>
    </div>
  );
}

function ProjectEntry({ project, index, onEdit, onDelete, canManage }) {
  const flip = index % 2 === 1;
  const feats = (project.features || []).slice(0, 4);
  const half = Math.ceil(feats.length / 2);

  const info = (
    <div>
      <div className="dk-proj-num">0{index + 1}</div>
      <span className="dk-proj-status">{project.status}</span>
      <div className="dk-proj-title">{project.title}</div>
      <div className="dk-proj-subtitle">{project.subtitle}</div>
      <div className="dk-proj-desc">{project.desc}</div>
      {feats.length > 0 && (
        <div className="dk-proj-features">
          <div>
            {feats.slice(0, half).map((f, i) => (
              <div className="dk-feat" key={i}>
                <span className="dk-feat-check">✓</span> {f}
              </div>
            ))}
          </div>
          <div>
            {feats.slice(half).map((f, i) => (
              <div className="dk-feat" key={i}>
                <span className="dk-feat-check">✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="dk-proj-tags">
        {(project.tags || []).map((t, i) => (
          <span className="dk-proj-tag" key={i}>{t}</span>
        ))}
      </div>
      {project.github && project.github !== "#" && (
        <a className="dk-github-btn" href={project.github} target="_blank" rel="noreferrer">
          ⎆ View on GitHub →
        </a>
      )}
      {canManage && (
        <div className="dk-proj-actions">
          <button className="dk-edit-btn" onClick={() => onEdit(index)}>Edit</button>
          <button className="dk-del-btn" onClick={() => onDelete(project.id)}>Delete</button>
        </div>
      )}
    </div>
  );

  const screenshot = <ScreenshotBox image={project.image} />;

  return (
    <div className="dk-project-entry">
      {flip ? <>{screenshot}{info}</> : <>{info}{screenshot}</>}
    </div>
  );
}

function Modal({ open, editIndex, initialData, onClose, onSave }) {
  const [form, setForm] = useState(initialData || EMPTY_FORM);
  const fileRef = useRef();

  // Sync when modal opens with new data
  useEffect(() => {
    setForm(initialData || EMPTY_FORM);
  }, [initialData]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set("image", ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.title.trim()) { alert("Project title is required."); return; }
    const proj = {
      ...form,
      id: editIndex >= 0 ? initialData.id : Date.now(),
      features: form.features.split("\n").map(s => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
    };
    onSave(proj);
  };

  if (!open) return null;

  return (
    <div className="dk-modal-bg" onClick={(e) => e.target.classList.contains("dk-modal-bg") && onClose()}>
      <div className="dk-modal">
        <h3>{editIndex >= 0 ? "Edit Project" : "Add New Project"}</h3>

        <div className="dk-field">
          <label>Project Title *</label>
          <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. ShopFlow" />
        </div>

        <div className="dk-field">
          <label>Subtitle / Type</label>
          <input value={form.subtitle} onChange={e => set("subtitle", e.target.value)} placeholder="e.g. Full-Stack E-Commerce Platform" />
        </div>

        <div className="dk-field">
          <label>Description</label>
          <textarea value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="Describe what this project does..." />
        </div>

        <div className="dk-field">
          <label>Features (one per line)</label>
          <textarea
            rows={4}
            value={form.features}
            onChange={e => set("features", e.target.value)}
            placeholder={"Customer & Admin roles\nCart & Checkout flow\nReal-time order tracking\nLive order feed"}
          />
          <div className="dk-field-hint">Each line becomes a ✓ feature bullet on the card.</div>
        </div>

        <div className="dk-field">
          <label>Tech Stack (comma separated)</label>
          <input value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="JavaScript, HTML, CSS, Node.js" />
        </div>

        <div className="dk-field">
          <label>Status</label>
          <select value={form.status} onChange={e => set("status", e.target.value)}>
            <option>Completed</option>
            <option>In Progress</option>
            <option>Planned</option>
          </select>
        </div>

        <div className="dk-field">
          <label>GitHub URL</label>
          <input value={form.github} onChange={e => set("github", e.target.value)} placeholder="https://github.com/..." />
        </div>

        <div className="dk-field">
          <label>Screenshot</label>
          <div className="dk-upload-zone" onClick={() => fileRef.current.click()}>
            {form.image
              ? <img src={form.image} alt="preview" />
              : <>
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ opacity: 0.5 }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="dk-upload-label">Click to upload screenshot</span>
                </>
            }
          </div>
          <input type="file" accept="image/*" ref={fileRef} onChange={handleImage} style={{ display: "none" }} />
        </div>

        <div className="dk-modal-footer">
          <button className="dk-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="dk-modal-save" onClick={handleSave}>Save Project</button>
        </div>
      </div>
    </div>
  );
}

// ─── Hire Modal Component ──────────────────────────────────────────────────────

function HireModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="dk-modal-bg" onClick={(e) => e.target.classList.contains("dk-modal-bg") && onClose()}>
      <div className="dk-hire-modal">
        <div className="dk-hire-header">
          <h3>Let's Work Together!</h3>
          <button className="dk-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="dk-hire-content">
          <div className="dk-resume-section">
            <h4>My Resume</h4>
            <div className="dk-resume-viewer">
              {/* Replace '/resume.pdf' with your actual resume file path */}
              <object
                data="/resume.pdf"
                type="application/pdf"
                width="100%"
                height="500px"
                style={{ border: 'none', borderRadius: '8px', display: 'block' }}
                aria-label="Resume PDF"
              >
                <div className="dk-resume-placeholder">
                  <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ opacity: 0.4 }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10,9 9,9 8,9" />
                  </svg>
                  <p>Resume Not Available</p>
                  <small>To add your resume:<br />1. Save your resume as 'resume.pdf'<br />2. Place it in the 'public' folder<br />3. Rebuild the project</small>
                  <a href="/resume.pdf" download style={{ marginTop: '8px', color: 'var(--green)', fontSize: '13px', fontWeight: 600 }}>⬇ Download Resume</a>
                </div>
              </object>
            </div>
          </div>
          <div className="dk-contact-section">
            <h4>Ready to discuss opportunities?</h4>
            <p>I'm excited to hear about your project and how we can collaborate!</p>
            <div className="dk-contact-actions">
              <button
                className="dk-contact-btn dk-contact-email"
                onClick={() => window.location.href = 'mailto:divyaakalia@gmail.com?subject=Project Opportunity&body=Hi Divya, I\'d like to discuss a project opportunity with you.'}
              >
                📧 Send Email
              </button>
              <button className="dk-contact-btn dk-contact-close" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function App() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [avatar, setAvatar] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [modalData, setModalData] = useState(EMPTY_FORM);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerKey, setOwnerKey] = useState("");
  const [showOwnerLogin, setShowOwnerLogin] = useState(false);
  const avatarRef = useRef();
  const importRef = useRef();

// Load projects from Firestore on mount
useEffect(() => {
  const loadProjects = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'projects'));
      const firestoreProjects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (firestoreProjects.length > 0) {
        setProjects(firestoreProjects);
      }
      // If Firestore is empty, INITIAL_PROJECTS stay as fallback
    } catch (error) {
      console.error('Error loading projects from Firestore:', error);
      // Falls back to INITIAL_PROJECTS defined in useState
    }
  };
  loadProjects();
}, []);

  // Load avatar from localStorage on component mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('portfolio-avatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  // Save avatar to localStorage whenever it changes
  useEffect(() => {
    if (avatar) {
      localStorage.setItem('portfolio-avatar', avatar);
    }
  }, [avatar]);

  const handleAvatar = (e) => {
    if (!isOwner) return;
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleOwnerLogin = () => {
    if (ownerKey === OWNER_PASSWORD) {
      setIsOwner(true);
      setOwnerKey("");
      setShowOwnerLogin(false);
    } else {
      alert('Incorrect owner password.');
    }
  };

  // Check URL for owner access
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('owner') === 'true') {
      setShowOwnerLogin(true);
    }
  }, []);

  const openAdd = () => {
    setEditIndex(-1);
    setModalData({ ...EMPTY_FORM });
    setModalOpen(true);
  };

  const openEdit = (i) => {
    const p = projects[i];
    setEditIndex(i);
    setModalData({
      ...p,
      features: (p.features || []).join("\n"),
      tags: (p.tags || []).join(", "),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    if (window.confirm(`Delete "${project.title}"?`)) {
      if (typeof id === 'string') {
        try {
          await deleteDoc(doc(db, 'projects', id));
        } catch (error) {
          console.error('Error deleting project:', error);
        }
      }
      setProjects(prev => prev.filter((p) => p.id !== id));
    }
  };

  const handleSave = async (proj) => {
    if (editIndex >= 0) {
      const existing = projects[editIndex];
      const isFirestoreId = typeof existing.id === 'string';
      let savedId = existing.id;

      if (isFirestoreId) {
        try {
          await updateDoc(doc(db, 'projects', existing.id), {
            title: proj.title,
            subtitle: proj.subtitle,
            desc: proj.desc,
            features: proj.features,
            tags: proj.tags,
            status: proj.status,
            github: proj.github,
            image: proj.image,
          });
        } catch (error) {
          console.error('Error updating project:', error);
          try {
            const docRef = await addDoc(collection(db, 'projects'), {
              title: proj.title,
              subtitle: proj.subtitle,
              desc: proj.desc,
              features: proj.features,
              tags: proj.tags,
              status: proj.status,
              github: proj.github,
              image: proj.image,
            });
            savedId = docRef.id;
          } catch (innerError) {
            console.error('Error saving updated project to Firestore:', innerError);
          }
        }
      } else {
        try {
          const docRef = await addDoc(collection(db, 'projects'), {
            title: proj.title,
            subtitle: proj.subtitle,
            desc: proj.desc,
            features: proj.features,
            tags: proj.tags,
            status: proj.status,
            github: proj.github,
            image: proj.image,
          });
          savedId = docRef.id;
        } catch (error) {
          console.error('Error adding fallback project to Firestore:', error);
        }
      }

      setProjects(prev => prev.map((p, i) => i === editIndex ? { ...proj, id: savedId } : p));
    } else {
      try {
        const docRef = await addDoc(collection(db, 'projects'), {
          title: proj.title,
          subtitle: proj.subtitle,
          desc: proj.desc,
          features: proj.features,
          tags: proj.tags,
          status: proj.status,
          github: proj.github,
          image: proj.image,
        });
        setProjects(prev => [...prev, { ...proj, id: docRef.id }]);
      } catch (error) {
        console.error('Error adding project:', error);
      }
    }
    setModalOpen(false);
  };

  const exportData = () => {
    const data = {
      projects,
      avatar,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
        if (data.avatar) {
          setAvatar(data.avatar);
        }
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav className="dk-nav">
        <div className="dk-logo">DK<span>.</span></div>
        <div className="dk-nav-tabs">
          {[
            { name: "About", id: "about" },
            { name: "Skills", id: "skills" },
            { name: "Projects", id: "projects" }
          ].map(({ name, id }) => (
            <button
              key={id}
              className="dk-nav-tab"
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            >
              {name}
            </button>
          ))}
        </div>
        <button className="dk-hire-btn" onClick={() => setHireModalOpen(true)}>Hire Me</button>
      </nav>

      {/* ── ABOUT ── */}
      <div id="about" className="dk-page">
        <div className="dk-about-grid">
          <div>
            <div className="dk-avail">
              <span className="dk-avail-dot" /> Available for opportunities
            </div>
            <div className="dk-hero-name">Divya<br /><span>Kalia</span></div>
            <div className="dk-hero-role">Java Full Stack Developer</div>
            <p className="dk-hero-bio">
              Hi, I'm Divya Kalia — currently pursuing my MCA from Panjab University,
              Chandigarh, with a sharp focus on Java and Full Stack Development.
            </p>
            <p className="dk-hero-bio">
              I'm passionate about crafting code that solves real problems. Whether it's
              designing robust backend systems with Spring Boot or building clean,
              interactive frontends, I love the challenge of bringing ideas to life
              through technology.
            </p>
            <p className="dk-hero-bio">
              I actively sharpen my skills in Data Structures &amp; Algorithms and enjoy
              projects that push me to think critically and build innovative solutions.
            </p>
            <div className="dk-contact-links">
              <a href="mailto:divyaakalia@gmail.com" className="dk-contact-link">📧 Email</a>
              <a href="https://www.linkedin.com/in/divya-kalia-49a692397/" target="_blank" rel="noreferrer" className="dk-contact-link">💼 LinkedIn</a>
              <a href="https://github.com/Diivvyaaa" target="_blank" rel="noreferrer" className="dk-contact-link">⎆ GitHub</a>
            </div>
            <div className="dk-hero-btns">
              <button className="dk-btn-green" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                View Projects
              </button>
              <button className="dk-btn-outline" onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })}>
                My Skills
              </button>
            </div>
          </div>

          <div className="dk-profile-card">
            <p className="dk-card-label">Profile Picture</p>
            <div className="dk-avatar-ring" onClick={() => isOwner && avatarRef.current?.click()} style={{ cursor: isOwner ? 'pointer' : 'default' }}>
              <img src={avatar || defaultAvatar} alt="Profile" />
              {isOwner && (
                <div className="dk-avatar-overlay">
                  <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Change Photo</span>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" ref={avatarRef} onChange={handleAvatar} style={{ display: "none" }} />
            <p className="dk-profile-name">Divya Kalia</p>
            <p className="dk-profile-role">Java Full Stack Developer</p>
            <div className="dk-stats-row">
              <div>
                <div className="dk-stat-num">{projects.length}+</div>
                <div className="dk-stat-lbl">Projects</div>
              </div>
              <div>
                <div className="dk-stat-num">10+</div>
                <div className="dk-stat-lbl">Skills</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SKILLS ── */}
      <div id="skills" className="dk-page">
        <div className="dk-section-header">
          <h2>What I Know</h2>
          <p>Technologies I've learned and actively use.</p>
        </div>
        <div className="dk-skills-grid">
          {SKILLS.map((s, i) => (
            <div className="dk-skill-card" key={i}>
              <div className="dk-skill-header">
                <span className="dk-skill-icon">{s.icon}</span>
                <span className="dk-skill-name">{s.name}</span>
              </div>
              <div className="dk-skill-tags">
                {s.tags.map((t, j) => <span className="dk-skill-tag" key={j}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROJECTS ── */}
      <div id="projects" className="dk-page">
        <div className="dk-section-header">
          <h2>Things I've Built</h2>
          <p>Each project below links directly to its GitHub repo. Hover the screenshot for a preview slideshow.</p>
        </div>
          <div className="dk-project-actions">
            {showOwnerLogin && !isOwner ? (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="password"
                  value={ownerKey}
                  onChange={(e) => setOwnerKey(e.target.value)}
                  placeholder="Owner password"
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #30363d', background: 'var(--bg3)', color: 'var(--text)', minWidth: '240px' }}
                />
                <button className="dk-export-btn" onClick={handleOwnerLogin}>
                  🔒 Owner Login
                </button>
              </div>
            ) : isOwner ? (
              <button className="dk-add-btn" onClick={openAdd}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add New Project
              </button>
            ) : null}
            {isOwner && (
              <div className="dk-data-actions">
                <button className="dk-export-btn" onClick={exportData}>
                  📥 Export Data
                </button>
                <button className="dk-import-btn" onClick={() => importRef.current.click()}>
                  📤 Import Data
                </button>
                <input
                  type="file"
                  ref={importRef}
                  onChange={importData}
                  accept=".json"
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>

          {projects.length === 0 ? (
            <div className="dk-empty">
              No projects yet. Click "Add New Project" to get started.
            </div>
          ) : (
            projects.map((project, index) => (
              <ProjectEntry
                key={project.id}
                project={project}
                index={index}
                onEdit={() => openEdit(index)}
                onDelete={handleDelete}
                canManage={isOwner}
              />
            ))
          )}
</div>
      {/* HIRE MODAL */}
      <HireModal open={hireModalOpen} onClose={() => setHireModalOpen(false)} />

      {/* MODALS */}
      <Modal
        open={modalOpen}
        editIndex={editIndex}
        initialData={modalData}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}