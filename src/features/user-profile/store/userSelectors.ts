import type { AppState } from "../../../modules/store/store";

export const selectProfile = (state: AppState) => state.userProfile.profile;
export const selectIsLoading = (state: AppState) => state.userProfile.isLoading;
export const selectError = (state: AppState) => state.userProfile.error;
export const selectIsEditing = (state: AppState) => state.userProfile.isEditing;
export const selectUsername = (state: AppState) =>
  state.userProfile.profile?.username;
export const selectEmail = (state: AppState) =>
  state.userProfile.profile?.email;
