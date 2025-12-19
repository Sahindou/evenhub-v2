import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsAuthenticated } from "../../../authentification/store/authSelectors";
import {
  selectProfile,
  selectIsLoading,
  selectError,
  selectIsEditing,
} from "../../store/userSelectors";
import {
  startEditing,
  cancelEditing,
  clearError,
} from "../../store/userSlice";
import { updateUserProfile } from "../../store/userThunks";
import { logout } from "../../../authentification/store/authSlice";
import type { AppDispatch } from "../../../../modules/store/store";

export const UserProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector(selectProfile);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isEditing = useSelector(selectIsEditing);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  // Synchroniser formData avec le profil
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username,
        email: profile.email,
      });
    }
  }, [profile]);

  // Nettoyer les erreurs au démontage
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Rediriger si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    dispatch(startEditing());
  };

  const handleCancel = () => {
    dispatch(cancelEditing());
    // Réinitialiser le formulaire
    if (profile) {
      setFormData({
        username: profile.username,
        email: profile.email,
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-slate-600">Chargement du profil...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card du profil */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-slate-800">
              Mon Profil
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              Déconnexion
            </button>
          </div>

          {/* Avatar placeholder */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSave} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                >
                  <circle
                    strokeWidth="1.5"
                    stroke="currentColor"
                    r={4}
                    cy={8}
                    cx={12}
                  />
                  <path
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20"
                  />
                </svg>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  className="w-full h-12 pl-11 pr-4 text-sm border border-gray-200 rounded-lg bg-slate-50 text-slate-800 transition-all duration-200 hover:border-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                >
                  <path
                    strokeWidth="1.5"
                    stroke="currentColor"
                    d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                  />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  className="w-full h-12 pl-11 pr-4 text-sm border border-gray-200 rounded-lg bg-slate-50 text-slate-800 transition-all duration-200 hover:border-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* ID (lecture seule) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ID Utilisateur
              </label>
              <div className="w-full h-12 px-4 text-sm border border-gray-200 rounded-lg bg-gray-100 text-slate-600 flex items-center font-mono">
                {profile.id}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex-1 h-12 bg-blue-500 text-white text-sm font-medium rounded-lg overflow-hidden transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                >
                  Modifier
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-gray-200 text-slate-700 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 bg-blue-500 text-white text-sm font-medium rounded-lg overflow-hidden transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                </>
              )}
            </div>
          </form>

          {/* Info supplémentaire */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-center text-slate-500">
              Membre depuis {new Date().toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
