import { useParams } from "react-router";

export function meta({ params }) {
  return [{ title: `${params.username || "Profile"} | FILLIN_APP_NAME` }];
}

export default function Profile() {
  const { username, courseSlug } = useParams();

  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>{username}</h1>
      {courseSlug && <p>Course: {courseSlug}</p>}
      <p style={{ color: "#666", marginTop: "1rem" }}>Public profile coming soon.</p>
    </div>
  );
}
