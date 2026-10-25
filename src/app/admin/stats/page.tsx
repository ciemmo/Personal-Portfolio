"use client";

import dynamic from "next/dynamic";

const AdminStatsContent = dynamic(() => import("./AdminStatsContent"), {
  ssr: false,
  loading: () => (
    <div className="admin-content-loading">
      <div className="spinner" />
      <p>Loading stats management...</p>
    </div>
  ),
});

export default function AdminStatsPage() {
  return <AdminStatsContent />;
}