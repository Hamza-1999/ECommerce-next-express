import { create } from "zustand";

interface CounterState {
  loggedIn: string;
  setLoggedIn: (value:string) => void;
}

const useStore = create<CounterState>((set) => ({
  loggedIn: "",
  setLoggedIn: (loggedIn: string) => set(() => ({ loggedIn }))
}));

export default useStore;
