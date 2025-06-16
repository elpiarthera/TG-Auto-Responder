import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Add public routes an array of strings or function
  // Example: publicRoutes: ["/", "/api/public-route"]
  // For now, let's make the home page public, and assume dashboard/api routes are protected by default.
  publicRoutes: ["/", "/api/auth/telegram"], // Making the old callback public for now, though it will likely be unused/removed.
});

export const config = {
  matcher: ["/((?!.+\.[\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};