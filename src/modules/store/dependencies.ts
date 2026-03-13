import type { AuthApi } from "../api/authApi";
import type { ProfileApi } from "../api/profileApi";
import type { DashboardApi } from "../api/dashboardApi";

export type Dependencies = {
  authApi: AuthApi;
  profileApi: ProfileApi;
  dashboardApi: DashboardApi; 
};
