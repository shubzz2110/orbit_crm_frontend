import type { Role } from "./definations";

/**
 * Get the appropriate dashboard route based on user role
 * @param role - User role(s) - can be string, string array, or null
 * @returns Dashboard route path
 */
export function getDashboardRoute(role: Role | null): string {
  if (!role) {
    return "/admin/dashboard"; // Default fallback
  }

  // Handle array of roles
  if (Array.isArray(role)) {
    // Check for Admin role first (highest priority)
    if (role.some((r) => r.toLowerCase() === "admin")) {
      return "/admin/dashboard";
    }
    // Check for Member role
    if (role.some((r) => r.toLowerCase() === "member")) {
      return "/member/dashboard";
    }
    // If multiple roles, use the first one
    if (role.length > 0) {
      const firstRole = role[0].toLowerCase();
      return `/${firstRole}/dashboard`;
    }
  }

  // Handle string role
  if (typeof role === "string") {
    const roleLower = role.toLowerCase();
    return `/${roleLower}/dashboard`;
  }

  // Default fallback
  return "/admin/dashboard";
}

/**
 * Verify if token is valid by checking if it exists and making a simple API call
 * @param token - Auth token
 * @returns Promise<boolean> - true if token is valid
 */
export async function verifyToken(token: string | null): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    // Make a simple API call to verify token
    // You can use a lightweight endpoint like user profile or a token verify endpoint
    const response = await fetch("http://localhost:8000/api/accounts/verify/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    return response.ok;
  } catch (error: unknown) {
    console.error("Error verifying token:", error);
    // If verify endpoint doesn't exist, we'll just check if token exists
    // In a real app, you might want to decode JWT and check expiration
    return !!token;
  }
}

