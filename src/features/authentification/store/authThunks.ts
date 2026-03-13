import type { AppDispatch, AppGetState } from "../../../modules/store/store";
import type { Dependencies } from "../../../modules/store/dependencies";
import { syncProfileFromAuth } from "../../user-profile/store/userThunks";
import {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  loginPending,
  require2FAVerification,
  loginComplete,
  twoFAVerifyFailure,
  authRestored,
} from "./authSlice";
import axios from "axios";

// validation de helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (
  password: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une majuscule");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une minuscule");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un caractère spécial");
  }

  return { valid: errors.length === 0, errors };
};

// un thunk pour l'inscription
export const registerUser = (
  username: string,
  email: string,
  password: string
) => {
  return async (dispatch: AppDispatch, _getState: unknown, extra: Dependencies) => {
    dispatch(registerStart());

    try {
      // Validations côté client
      if (!username || !email || !password) {
        throw new Error("Tous les champs sont obligatoires");
      }

      if (!isValidEmail(email)) {
        throw new Error("Email invalide");
      }

      const passwordValidation = isValidPassword(password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.errors.join(", "));
      }

      // Appel API
      const data = await extra.authApi.register(username, email, password);

      // Stocker le token JWT
      localStorage.setItem("token", data.token);

      // Connecter l'utilisateur
      dispatch(registerSuccess(data.user));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(
          registerFailure(error.response?.data?.message ?? "Erreur lors de l'inscription")
        );
      } else {
        dispatch(
          registerFailure(
            error instanceof Error ? error.message : "Erreur inconnue"
          )
        );
      }
    }
  };
};

// un thunk pour restaurer la session depuis le localStorage au démarrage
export const restoreAuth = () => {
  return (dispatch: AppDispatch) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Décoder le payload JWT (base64url → JSON) sans librairie
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));

      // Vérifier l'expiration du token
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return;
      }

      // Rehydrater le store avec les données du token
      dispatch(loginSuccess({
        id: payload.id ?? payload.sub ?? "",
        username: payload.username ?? "",
        email: payload.email ?? "",
      }));

      // Charger le profil depuis l'API
      dispatch(syncProfileFromAuth());
    } catch {
      // Token malformé : on le supprime
      localStorage.removeItem("token");
    } finally {
      // Signale que la restauration est terminée dans tous les cas
      dispatch(authRestored());
    }
  };
};

// un thunk pour la connexion
export const loginUser = (email: string, password: string) => {
  return async (dispatch: AppDispatch, getState: AppGetState, extra: Dependencies) => {
    dispatch(loginStart());

    try {
      // Validation côté client
      if (!email || !password) throw new Error("Tous les champs sont requis");

      // Appel API
      const data = await extra.authApi.login(email, password);

      // Stocker le token JWT (nécessaire pour les requêtes suivantes)
      localStorage.setItem("token", data.data.token);

      // Marquer l'utilisateur comme en attente (pas encore authentifié)
      dispatch(loginPending(data.data.user));

      // Récupérer le profil pour savoir si la 2FA est activée
      await dispatch(syncProfileFromAuth());

      const { userProfile } = getState();
      if (userProfile.is2FAEnabled) {
        dispatch(require2FAVerification());
      } else {
        dispatch(loginComplete());
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(
          loginFailure(error.response?.data?.message ?? "Email ou mot de passe incorrect")
        );
      } else {
        dispatch(
          loginFailure(error instanceof Error ? error.message : "Erreur inconnue")
        );
      }
    }
  };
};

// Thunk pour vérifier le code TOTP lors de la connexion
export const verify2FAAtLogin = (token: string) => {
  return async (dispatch: AppDispatch, _getState: AppGetState, extra: Dependencies) => {
    dispatch(loginStart());
    try {
      await extra.authApi.verifyTOTPLogin(token);
      dispatch(loginComplete());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(twoFAVerifyFailure(error.response?.data?.message ?? "Code invalide"));
      } else {
        dispatch(twoFAVerifyFailure(error instanceof Error ? error.message : "Erreur inconnue"));
      }
    }
  };
};

// Thunk pour utiliser un code de secours lors de la connexion
export const useBackupCodeAtLogin = (code: string) => {
  return async (dispatch: AppDispatch, _getState: AppGetState, extra: Dependencies) => {
    dispatch(loginStart());
    try {
      await extra.authApi.useBackupCode(code);
      dispatch(loginComplete());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(twoFAVerifyFailure(error.response?.data?.message ?? "Code de secours invalide"));
      } else {
        dispatch(twoFAVerifyFailure(error instanceof Error ? error.message : "Erreur inconnue"));
      }
    }
  };
};
