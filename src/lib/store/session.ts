"use client";

import { create } from "zustand";

interface SessionState {
  signedIn: boolean;
  user: {
    name: string;
    email: string;
    handle: string;
  };
  signIn: () => void;
  signOut: () => void;
}

const emptyUser = {
  name: "",
  email: "",
  handle: "",
};

export const useSession = create<SessionState>(() => ({
  signedIn: false,
  user: emptyUser,

  // Login hanya boleh dilakukan melalui Supabase Auth.
  signIn: () => {},

  // Gunakan useAuth().signOut() untuk logout sungguhan.
  signOut: () => {},
}));
