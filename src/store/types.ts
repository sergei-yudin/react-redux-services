export type Service = { id: string; name: string; price: number };
export type FormErrors = { name?: string; price?: string };
export type FormState = {
  name: string;
  price: string;
  editingId: string | null;
  errors: FormErrors;
};
export type RootState = {
  services: { items: Service[] };
  form: FormState;
  filter: { searchTerm: string };
};

export type Action =
  | {
      type: "SET_FORM_FIELD";
      payload: { field: "name" | "price"; value: string };
    }
  | { type: "START_EDITING"; payload: Service }
  | { type: "CANCEL_EDITING" }
  | { type: "SAVE_SERVICE" }
  | { type: "DELETE_SERVICE"; payload: string }
  | { type: "SET_ERRORS"; payload: FormErrors }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "CLEAR_SEARCH" };
