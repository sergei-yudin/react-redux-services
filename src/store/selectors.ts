import { createSelector } from "reselect";
import type { RootState } from "./types";

export const selectServices = (state: RootState) => state.services.items;
export const selectForm = (state: RootState) => state.form;
export const selectSearchTerm = (state: RootState) => state.filter.searchTerm;

export const selectFilteredServices = createSelector(
  [selectServices, selectSearchTerm],
  (services, searchTerm) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return services.filter(({ name }) =>
      name.toLowerCase().includes(normalizedSearch),
    );
  },
);
