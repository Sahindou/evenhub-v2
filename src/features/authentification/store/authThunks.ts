import type { AppDispatch, AppGetState } from "../../../modules/store/store";
import { syncProfileFromAuth } from "../../user-profile/store/userThunks";
import {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  addUserToDb,
  type User,
} from "./authSlice";

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
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    console.log("🚀 [REGISTER] Début de l'inscription", { username, email });
    dispatch(registerStart());

    // simulation de délai réseau
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Validations
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

      // Vérifier si l'email existe déjà
      const { auth } = getState();
      console.log("📊 [REGISTER] Users existants dans le store:", auth.users);
      const emailExists = auth.users.some((u) => u.email === email);

      if (emailExists) {
        throw new Error("Cet email est déjà utilisé");
      }

      // Créer l'utilisateur
      const newUser: User & { password: string } = {
        id: crypto.randomUUID(),
        username,
        email,
        password, // En production, JAMAIS stocker en clair !
      };

      console.log("✨ [REGISTER] Nouvel utilisateur créé:", { ...newUser, password: "***" });

      // Ajouter à la DB simulée
      dispatch(addUserToDb(newUser));

      // Vérifier que l'utilisateur a été ajouté
      const updatedState = getState();
      console.log("💾 [REGISTER] Users après ajout:", updatedState.auth.users);

      // Connecter l'utilisateur
      const { password: _, ...userWithoutPassword } = newUser;
      dispatch(registerSuccess(userWithoutPassword));

      console.log("✅ [REGISTER] Inscription réussie, utilisateur connecté:", userWithoutPassword);
    } catch (error) {
      console.error("❌ [REGISTER] Erreur lors de l'inscription:", error);
      dispatch(
        registerFailure(
          error instanceof Error ? error.message : "Erreur inconnue"
        )
      );
    }
  };
};

// un thuk pour la connexion
export const loginUser = (email: string, password: string) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    console.log("🔑 [LOGIN] Tentative de connexion", { email });
    dispatch(loginStart());

    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // validation
      if (!email || !password) throw new Error("Tous les champs sont requis");

      // Rechercher l'utilisateur
      const { auth } = getState();
      console.log("📊 [LOGIN] Tous les utilisateurs dans le store:", auth.users);
      console.log("🔍 [LOGIN] Recherche de l'utilisateur avec email:", email);

      const user = auth.users.find(
        (u) => u.email === email && u.password === password
      );

      console.log("🔍 [LOGIN] Utilisateur trouvé:", user ? { ...user, password: "***" } : null);

      if (!user) {
        console.error("❌ [LOGIN] Aucun utilisateur trouvé avec ces credentials");
        throw new Error("Email ou mot de passe incorrect");
      }

      // Connecter l'utilisateur
      const { password: _, ...userWithoutPassword } = user;
      dispatch(loginSuccess(userWithoutPassword));
      console.log("✅ [LOGIN] Connexion réussie:", userWithoutPassword);

      dispatch(syncProfileFromAuth()); // Synchroniser le profil
      console.log("👤 [LOGIN] Profil synchronisé");

    } catch (error) {
      console.error("❌ [LOGIN] Erreur lors de la connexion:", error);
      dispatch(
        loginFailure(error instanceof Error ? error.message : "Erreur inconnue")
      );
    }
  };
};
