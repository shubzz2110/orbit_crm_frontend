import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role, AuthState } from '@/lib/definations';

interface AuthStore extends AuthState {
  // Actions
  setAuth: (user: User, token: string, role: Role) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRole: (role: Role | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      // Actions
      setAuth: (user, token, role) =>
        set({
          user,
          token,
          role,
          isAuthenticated: true,
        }),

      setUser: (user) =>
        set((state) => ({
          user,
          isAuthenticated: !!user && !!state.token,
        })),

      setToken: (token) =>
        set((state) => ({
          token,
          isAuthenticated: !!token && !!state.user,
        })),

      setRole: (role) =>
        set({
          role,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage', // localStorage key
      // Optional: only persist specific fields
      // partialize: (state) => ({ user: state.user, token: state.token, role: state.role }),
    }
  )
);
