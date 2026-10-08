import { nanoid } from "nanoid";
import type { Action, FormState, RootState } from "./types";

const emptyForm: FormState = {
  name: "",
  price: "",
  editingId: null,
  errors: {},
};

export const initialState: RootState = {
  services: {
    items: [
      { id: nanoid(), name: "Замена стекла", price: 21_000 },
      { id: nanoid(), name: "Замена дисплея", price: 25_000 },
      { id: nanoid(), name: "Замена аккумулятора", price: 4_000 },
    ],
  },
  form: emptyForm,
  filter: { searchTerm: "" },
};

export function reducer(state = initialState, action: Action): RootState {
  switch (action.type) {
    case "SET_FORM_FIELD":
      return {
        ...state,
        form: {
          ...state.form,
          [action.payload.field]: action.payload.value,
          errors: { ...state.form.errors, [action.payload.field]: undefined },
        },
      };
    case "START_EDITING":
      return {
        ...state,
        form: {
          name: action.payload.name,
          price: String(action.payload.price),
          editingId: action.payload.id,
          errors: {},
        },
      };
    case "CANCEL_EDITING":
      return { ...state, form: emptyForm };
    case "SET_ERRORS":
      return { ...state, form: { ...state.form, errors: action.payload } };
    case "SAVE_SERVICE": {
      const service = {
        id: state.form.editingId ?? nanoid(),
        name: state.form.name.trim(),
        price: Number(state.form.price),
      };
      const items = state.form.editingId
        ? state.services.items.map((item) =>
            item.id === service.id ? service : item,
          )
        : [...state.services.items, service];
      return { ...state, services: { items }, form: emptyForm };
    }
    case "DELETE_SERVICE":
      return {
        ...state,
        services: {
          items: state.services.items.filter(({ id }) => id !== action.payload),
        },
        form: state.form.editingId === action.payload ? emptyForm : state.form,
      };
    case "SET_SEARCH_TERM":
      return { ...state, filter: { searchTerm: action.payload } };
    case "CLEAR_SEARCH":
      return { ...state, filter: { searchTerm: "" } };
    default:
      return state;
  }
}
