import type { LeadTableRow } from "@/types/lead";
import type { SortField, SortOrder } from "@/lib/server/read/getTableLeads";
import type { InitialLeadData } from "@/components/leads/panel/lib/types";

export type LeadsAction =
  | {
      type: "SORT";
      payload: {
        leads: LeadTableRow[];
        total: number;
        sortBy: SortField;
        sortOrder: SortOrder;
      };
    }
  | {
      type: "PAGE";
      payload: { leads: LeadTableRow[]; total: number; page: number };
    };

export function leadsReducer(
  state: InitialLeadData,
  action: LeadsAction,
): InitialLeadData {
  switch (action.type) {
    case "SORT":
      return {
        ...state,
        page: 1,
        leads: action.payload.leads,
        total: action.payload.total,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
      };
    case "PAGE":
      return {
        ...state,
        leads: action.payload.leads,
        total: action.payload.total,
        page: action.payload.page,
      };
  }
}
