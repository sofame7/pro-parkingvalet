import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy(req) {
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/dashboard/:path*", "/api/users/:path*", "/api/schedules/:path*"] };
