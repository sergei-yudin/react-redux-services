import type { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectForm, selectServices } from "../store/selectors";
import type { AppDispatch } from "../store/store";
import { validateService } from "../utils/validateService";

export function ServiceForm() {
  const dispatch = useDispatch<AppDispatch>();
  const form = useSelector(selectForm);
  const services = useSelector(selectServices);
  const editingService = services.find(({ id }) => id === form.editingId);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const errors = validateService(form.name, form.price);
    dispatch(
      Object.keys(errors).length
        ? { type: "SET_ERRORS", payload: errors }
        : { type: "SAVE_SERVICE" },
    );
  };

  return (
    <section className={`panel form-panel ${editingService ? "editing" : ""}`}>
      <div className="section-title">
        <div>
          <span>
            {editingService ? "Режим редактирования" : "Новая услуга"}
          </span>
          <h2>{editingService?.name ?? "Добавить услугу"}</h2>
        </div>
        <b>{services.length} услуг</b>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Название
          <input
            aria-label="Название услуги"
            value={form.name}
            onChange={(event) =>
              dispatch({
                type: "SET_FORM_FIELD",
                payload: { field: "name", value: event.target.value },
              })
            }
            placeholder="Например, настройка телефона"
          />
          {form.errors.name && <small>{form.errors.name}</small>}
        </label>
        <label>
          Цена, ₽
          <input
            aria-label="Цена"
            type="number"
            value={form.price}
            onChange={(event) =>
              dispatch({
                type: "SET_FORM_FIELD",
                payload: { field: "price", value: event.target.value },
              })
            }
            placeholder="0"
          />
          {form.errors.price && <small>{form.errors.price}</small>}
        </label>
        <div className="actions">
          <button type="submit">Save</button>
          {editingService && (
            <button
              className="secondary"
              type="button"
              onClick={() => dispatch({ type: "CANCEL_EDITING" })}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
