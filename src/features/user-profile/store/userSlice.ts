import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
}

export interface UserProfilState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
}

const initialState: UserProfilState = {
  profile: null,
  isLoading: false,
  error: null,
  isEditing: false,
};

const userSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    // récuperer les infos user profile
    fetchProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.isLoading = false;
      state.profile = action.payload;
      state.error = null;
    },

    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // maj du profile
    updateProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    updateProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.isLoading = false;
      state.profile = action.payload;
      state.error = null;
      state.isEditing = false;
    },

    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    startEditing: (state) => {
      state.isEditing = true;
      state.error = null;
    },

    cancelEditing(state) {
      state.isEditing = false;
      state.error = null;
    },

    // Mise à jour locale 
    updateProfileLocally(state, action: PayloadAction<Partial<UserProfile>>) {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },

    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  startEditing,
  cancelEditing,
  updateProfileLocally,
  clearError,
} = userSlice.actions;

export const userProfileReducer = userSlice.reducer;