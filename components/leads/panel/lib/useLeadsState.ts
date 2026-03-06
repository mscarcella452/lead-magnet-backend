import type { InitialLeadData } from "@/components/leads/panel/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useReducer, useTransition, useCallback } from "react";
import { toast } from "sonner";
import { getTableLeadsAction } from "@/lib/server/actions/read/getTableLeadsAction";
import { buildUpdatedParams } from "@/components/leads/panel/lib/helpers";
import type { SortField } from "@/lib/server/read/getTableLeads";
import { leadsReducer } from "@/components/leads/panel/lib/leadsReducer";

export function useLeadsState(initialLeadData: InitialLeadData) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, startTransition] = useTransition();
  const [state, dispatch] = useReducer(leadsReducer, initialLeadData);

  const totalPages = Math.ceil(state.total / state.limit);

  const fetchLeads = useCallback(
    async (params: Parameters<typeof getTableLeadsAction>[0]) => {
      const result = await getTableLeadsAction(params);
      if (!result.success) toast.error(result.error);
      return result;
    },
    [],
  );

  const updateUrl = useCallback(
    (updates: Record<string, string>) => {
      router.replace(`?${buildUpdatedParams(searchParams, updates)}`, {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  const handleSort = useCallback(
    (field: SortField) => {
      if (isLoading) return;

      const newSortOrder =
        field === state.sortBy && state.sortOrder === "desc" ? "asc" : "desc";

      updateUrl({ sortBy: field, sortOrder: newSortOrder, page: "1" });

      startTransition(async () => {
        const result = await fetchLeads({
          limit: state.limit,
          offset: 0,
          sortBy: field,
          sortOrder: newSortOrder,
        });

        if (result.success) {
          dispatch({
            type: "SORT",
            payload: {
              leads: result.data.leads,
              total: result.data.total,
              sortBy: field,
              sortOrder: newSortOrder,
            },
          });
        }
      });
    },
    [
      isLoading,
      state.sortBy,
      state.sortOrder,
      state.limit,
      updateUrl,
      fetchLeads,
    ],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      if (isLoading || nextPage < 1 || nextPage > totalPages) return;

      updateUrl({ page: nextPage.toString() });

      startTransition(async () => {
        const result = await fetchLeads({
          limit: state.limit,
          offset: (nextPage - 1) * state.limit,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        });

        if (result.success) {
          dispatch({
            type: "PAGE",
            payload: {
              leads: result.data.leads,
              total: result.data.total,
              page: nextPage,
            },
          });
        }
      });
    },
    [
      isLoading,
      totalPages,
      state.limit,
      state.sortBy,
      state.sortOrder,
      updateUrl,
      fetchLeads,
    ],
  );

  const refetch = useCallback(() => {
    startTransition(async () => {
      const result = await fetchLeads({
        limit: state.limit,
        offset: (state.page - 1) * state.limit,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      });

      if (result.success) {
        dispatch({
          type: "PAGE",
          payload: {
            leads: result.data.leads,
            total: result.data.total,
            page: state.page,
          },
        });
      }
    });
  }, [state.limit, state.page, state.sortBy, state.sortOrder, fetchLeads]);

  return {
    state,
    totalPages,
    isLoading,
    handleSort,
    handlePageChange,
    refetch,
  };
}
