import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminHub() {
  return (
    <section className="admin-hub">
      <div className="container">
        <h1 className="title">Admin Dashboard</h1>
        <p className="description">
          Manage your portfolio content and settings from this central hub.
        </p>

        <div className="admin-grid">
          {/* Content Management */}
          <div className="admin-section">
            <h2 className="sectionTitle">Content Management</h2>
            <div className="admin-links">
              <Link href="/admin/stats" className="adminLink">
                <span className="adminLinkIcon">📊</span>
                <span>Site Stats</span>
              </Link>
              <Link href="/admin/skills" className="adminLink">
                <span className="adminLinkIcon">🎯</span>
                <span>Skills</span>
              </Link>
              <Link href="/admin/education" className="adminLink">
                <span className="adminLinkIcon">📚</span>
                <span>Education</span>
              </Link>
              <Link href="/admin/workExperience" className="adminLink">
                <span className="adminLinkIcon">💼</span>
                <span>Work Experience</span>
              </Link>
              <Link href="/admin/certifications" className="adminLink">
                <span className="adminLinkIcon">🏆</span>
                <span>Certifications</span>
              </Link>
              <Link href="/admin/continuingEducation" className="adminLink">
                <span className="adminLinkIcon">📈</span>
                <span>Continuing Education</span>
              </Link>
              <Link href="/admin/achievements" className="adminLink">
                <span className="adminLinkIcon">🏅</span>
                <span>Achievements</span>
              </Link>
              <Link href="/admin/upload-resume" className="adminLink">
                <span className="adminLinkIcon">📄</span>
                <span>Upload Resume</span>
              </Link>
            </div>
          </div>

          {/* System & Settings */}
          <div className="admin-section">
            <h2 className="sectionTitle">System & Settings</h2>
            <div className="admin-links">
              <Link href="/admin/login" className="adminLink">
                <span className="adminLinkIcon">🔐</span>
                <span>Login</span>
              </Link>
              {/* Add more system/admin links as needed */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}