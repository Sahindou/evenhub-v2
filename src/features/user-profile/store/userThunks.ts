import type { AppDispatch, AppGetState } from "../../../modules/store/store";
import {
  fetchProfileSuccess,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  type UserProfile,
} from "./userSlice";

// Thunk pour synchroniser le profil après login
export const syncProfileFromAuth = () => {
  return (dispatch: AppDispatch, getState: AppGetState) => {
    const { auth } = getState();

    if (auth.user) {
      // Convertir l'user d'auth en profil complet
      const profile: UserProfile = {
        id: auth.user.id,
        username: auth.user.username,
        email: auth.user.email,
      };

      dispatch(fetchProfileSuccess(profile));
    }
  };
};

// Thunk pour mettre à jour le profil
export const updateUserProfile = (updates: Partial<UserProfile>) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    dispatch(updateProfileStart());

    // Simulation de délai réseau
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const { userProfile } = getState();

      if (!userProfile.profile) {
        throw new Error("Aucun profil à mettre à jour");
      }

      // Simuler la mise à jour (en production, ce serait un appel API)
      const updatedProfile: UserProfile = {
        ...userProfile.profile,
        ...updates,
      };

      // Validation basique
      if (updates.username && updates.username.length < 3) {
        throw new Error(
          "Le nom d'utilisateur doit contenir au moins 3 caractères"
        );
      }

      if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
        throw new Error("Email invalide");
      }

      dispatch(updateProfileSuccess(updatedProfile));
    } catch (error) {
      dispatch(
        updateProfileFailure(
          error instanceof Error ? error.message : "Erreur inconnue"
        )
      );
    }
  };
};
