import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  users: Array<User & { password: string }>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Etat initial
const initialState: AuthState = {
  user: null,
  users: [],
  isAuthenticated: false,
  isLoading: false,
  error: null,
};



// slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // les actions synchrone
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    registerSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    //helper pour simuler un user dans la bdd
    addUserToDb: (
      state,
      action: PayloadAction<User & { password: string }>
    ) => {
      console.log("💾 [SLICE] addUserToDb - Ajout d'un utilisateur:", { ...action.payload, password: "***" });
      console.log("💾 [SLICE] addUserToDb - Nombre d'users avant:", state.users.length);
      state.users.push(action.payload);
      console.log("💾 [SLICE] addUserToDb - Nombre d'users après:", state.users.length);
      console.log("💾 [SLICE] addUserToDb - Tous les users:", state.users.map(u => ({ ...u, password: "***" })));
    },

  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  addUserToDb,
} = authSlice.actions;

export const authReducer = authSlice.reducer;

