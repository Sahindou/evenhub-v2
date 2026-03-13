import type { AuthApi } from "../api/authApi";
import type { ProfileApi } from "../api/profileApi";

export type Dependencies = {
  authApi: AuthApi;
  profileApi: ProfileApi;
}