import axios from "@/plugins/axios";
import type { RouteRecordName } from "vue-router";

export function useRouteCheck() {
  const canUserAccess = async (
    routeName?: RouteRecordName | null
  ): Promise<boolean> => {
    let canAccess = false;
    try {
      if (routeName) {
        const queryParams = {
          routeName: routeName,
        };
        const response: any = await axios.get("/usermenuprivilege/routecheck", {
          params: queryParams,
        });
        canAccess = response.result;
      }
    } catch (error: any) {
      canAccess = false;
    }
    return canAccess;
  };

  return {
    canUserAccess,
  };
}
