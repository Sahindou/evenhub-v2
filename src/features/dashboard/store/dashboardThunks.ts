import type { AppDispatch, AppGetState } from "../../../modules/store/store";
import type { Dependencies } from "../../../modules/store/dependencies";
import { fetchStatsStart, fetchStatsSuccess, fetchStatsFailure } from "./dashboardSlice";

export const fetchDashboardStats =
  () =>
  async (dispatch: AppDispatch, _getState: AppGetState, { dashboardApi }: Dependencies) => {
    dispatch(fetchStatsStart());
    try {
      const response = await dashboardApi.getStats();
      dispatch(fetchStatsSuccess(response.data));
    } catch (error: any) {
      dispatch(fetchStatsFailure(error.message || "Erreur lors du chargement"));
    }
  };
