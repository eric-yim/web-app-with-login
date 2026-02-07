import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  // Landing page - will be pre-rendered (SSG)
  index("routes/home.jsx"),

  // Auth routes
  route("oauth/callback", "routes/oauth-callback.jsx"),

  // Admin (protected)
  route("admin", "routes/admin.jsx"),

  // Public profile page
  route(":username/:courseSlug?", "routes/profile.jsx"),
] satisfies RouteConfig;
