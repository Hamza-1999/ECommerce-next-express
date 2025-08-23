import type { AuthUser } from "./types"

// Mock authentication for development
export const mockAuth = {
  currentUser: null as AuthUser | null,

  login: async (email: string, password: string): Promise<AuthUser | null> => {
    // Mock login logic - replace with real authentication
    if (email === "admin@hijabstore.com" && password === "admin") {
      const user: AuthUser = {
        _id: "user1",
        email: "admin@hijabstore.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
      }
      mockAuth.currentUser = user
      return user
    }

    if (email === "customer@example.com" && password === "customer") {
      const user: AuthUser = {
        _id: "user2",
        email: "customer@example.com",
        firstName: "Sarah",
        lastName: "Ahmed",
        role: "user",
      }
      mockAuth.currentUser = user
      return user
    }

    return null
  },

  logout: () => {
    mockAuth.currentUser = null
  },

  isAuthenticated: (): boolean => {
    return mockAuth.currentUser !== null
  },

  isAdmin: (): boolean => {
    return mockAuth.currentUser?.role === "admin"
  },
}
