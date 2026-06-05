import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isSubscribed: false,
  setUser: (user) => set({ user }),
  setSubscribed: (status) => set({ isSubscribed: status }),
}));

export default useAuthStore;