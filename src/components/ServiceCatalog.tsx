import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFilteredServices,
  selectSearchTerm,
  selectServices,
} from "../store/selectors";
import type { AppDispatch } from "../store/store";

export function ServiceCatalog() {
  const dispatch = useDispatch<AppDispatch>();
  const services = useSelector(selectServices);
  const filteredServices = useSelector(selectFilteredServices);
  const searchTerm = useSelector(selectSearchTerm);
  const searchInput = useRef<HTMLInputElement>(null);

  const clearSearch = () => {
    dispatch({ type: "CLEAR_SEARCH" });
    searchInput.current?.focus();
  };

  return (
    <section className="panel">
      <div className="search">
        <input
          ref={searchInput}
          aria-label="Поиск услуг"
          value={searchTerm}
          onChange={(event) =>
            dispatch({ type: "SET_SEARCH_TERM", payload: event.target.value })
          }
          placeholder="Поиск услуг..."
        />
        <button
          type="button"
          aria-label="Очистить поиск"
          disabled={!searchTerm}
          onClick={clearSearch}
        >
          ×
        </button>
      </div>
      <p className="stats">
        Найдено: <b>{filteredServices.length}</b> из {services.length} услуг
      </p>
      <div className="list">
        {filteredServices.length ? (
          filteredServices.map((service) => (
            <article key={service.id} className="service">
              <div>
                <h3>{service.name}</h3>
                <p>{service.price.toLocaleString("ru-RU")} ₽</p>
              </div>
              <div className="row-actions">
                <button
                  className="edit"
                  onClick={() =>
                    dispatch({ type: "START_EDITING", payload: service })
                  }
                >
                  Редактировать
                </button>
                <button
                  className="delete"
                  aria-label={`Удалить ${service.name}`}
                  onClick={() =>
                    dispatch({ type: "DELETE_SERVICE", payload: service.id })
                  }
                >
                  ×
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="empty">Услуги не найдены</div>
        )}
      </div>
    </section>
  );
}
