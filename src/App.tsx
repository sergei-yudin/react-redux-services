import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { nanoid } from 'nanoid'
import { createSelector } from 'reselect'
import './App.css'

type Service = { id: string; name: string; price: number }
type FormState = { name: string; price: string; editingId: string | null; errors: { name?: string; price?: string } }
type State = { services: { items: Service[] }; form: FormState; filter: { searchTerm: string } }
type Action = { type: 'SET_FORM_FIELD'; payload: { field: 'name' | 'price'; value: string } } | { type: 'START_EDITING'; payload: Service } | { type: 'CANCEL_EDITING' } | { type: 'SAVE_SERVICE' } | { type: 'DELETE_SERVICE'; payload: string } | { type: 'SET_ERRORS'; payload: FormState['errors'] } | { type: 'SET_SEARCH_TERM'; payload: string } | { type: 'CLEAR_SEARCH' }

export const initialState: State = { services: { items: [{ id: nanoid(), name: 'Замена стекла', price: 21000 }, { id: nanoid(), name: 'Замена дисплея', price: 25000 }, { id: nanoid(), name: 'Замена аккумулятора', price: 4000 }] }, form: { name: '', price: '', editingId: null, errors: {} }, filter: { searchTerm: '' } }
const cleanForm: FormState = { name: '', price: '', editingId: null, errors: {} }

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case 'SET_FORM_FIELD': return { ...state, form: { ...state.form, [action.payload.field]: action.payload.value, errors: { ...state.form.errors, [action.payload.field]: undefined } } }
    case 'START_EDITING': return { ...state, form: { name: action.payload.name, price: String(action.payload.price), editingId: action.payload.id, errors: {} } }
    case 'CANCEL_EDITING': return { ...state, form: cleanForm }
    case 'SET_ERRORS': return { ...state, form: { ...state.form, errors: action.payload } }
    case 'SAVE_SERVICE': { const item = { id: state.form.editingId ?? nanoid(), name: state.form.name.trim(), price: Number(state.form.price) }; const items = state.form.editingId ? state.services.items.map((service) => service.id === item.id ? item : service) : [...state.services.items, item]; return { ...state, services: { items }, form: cleanForm } }
    case 'DELETE_SERVICE': return { ...state, services: { items: state.services.items.filter(({ id }) => id !== action.payload) }, form: state.form.editingId === action.payload ? cleanForm : state.form }
    case 'SET_SEARCH_TERM': return { ...state, filter: { searchTerm: action.payload } }
    case 'CLEAR_SEARCH': return { ...state, filter: { searchTerm: '' } }
    default: return state
  }
}

const selectFiltered = createSelector([(state: State) => state.services.items, (state: State) => state.filter.searchTerm], (items, term) => items.filter(({ name }) => name.toLowerCase().includes(term.trim().toLowerCase())))
function validate(name: string, price: string) { const errors: FormState['errors'] = {}; if (name.trim().length < 2) errors.name = 'Введите минимум 2 символа'; if (!price || Number(price) <= 0) errors.price = 'Цена должна быть больше 0'; return errors }

function App() {
  const dispatch = useDispatch(); const state = useSelector((value: State) => value); const filtered = useSelector(selectFiltered); const searchRef = useRef<HTMLInputElement>(null); const editing = state.services.items.find(({ id }) => id === state.form.editingId)
  const submit = (event: React.FormEvent) => { event.preventDefault(); const errors = validate(state.form.name, state.form.price); if (Object.keys(errors).length) dispatch({ type: 'SET_ERRORS', payload: errors }); else dispatch({ type: 'SAVE_SERVICE' }) }
  return <main className="shell"><header><p className="eyebrow">REDUX SERVICE DESK</p><h1>Управление услугами</h1><p>Единое Redux-хранилище для формы, каталога и поиска.</p></header>
    <section className={`panel form-panel ${editing ? 'editing' : ''}`}><div className="section-title"><div><span>{editing ? 'Режим редактирования' : 'Новая услуга'}</span><h2>{editing ? editing.name : 'Добавить услугу'}</h2></div><b>{state.services.items.length} услуг</b></div>
      <form onSubmit={submit} noValidate><label>Название<input aria-label="Название услуги" value={state.form.name} onChange={(e) => dispatch({ type: 'SET_FORM_FIELD', payload: { field: 'name', value: e.target.value } })} placeholder="Например, настройка телефона" />{state.form.errors.name && <small>{state.form.errors.name}</small>}</label><label>Цена, ₽<input aria-label="Цена" type="number" value={state.form.price} onChange={(e) => dispatch({ type: 'SET_FORM_FIELD', payload: { field: 'price', value: e.target.value } })} placeholder="0" />{state.form.errors.price && <small>{state.form.errors.price}</small>}</label><div className="actions"><button type="submit">Save</button>{editing && <button className="secondary" type="button" onClick={() => dispatch({ type: 'CANCEL_EDITING' })}>Cancel</button>}</div></form>
    </section><section className="panel"><div className="search"><input ref={searchRef} aria-label="Поиск услуг" value={state.filter.searchTerm} onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })} placeholder="Поиск услуг..." /><button type="button" aria-label="Очистить поиск" disabled={!state.filter.searchTerm} onClick={() => { dispatch({ type: 'CLEAR_SEARCH' }); searchRef.current?.focus() }}>×</button></div><p className="stats">Найдено: <b>{filtered.length}</b> из {state.services.items.length} услуг</p><div className="list">{filtered.length ? filtered.map((service) => <article key={service.id} className="service"><div><h3>{service.name}</h3><p>{service.price.toLocaleString('ru-RU')} ₽</p></div><div className="row-actions"><button className="edit" onClick={() => dispatch({ type: 'START_EDITING', payload: service })}>Редактировать</button><button className="delete" aria-label={`Удалить ${service.name}`} onClick={() => dispatch({ type: 'DELETE_SERVICE', payload: service.id })}>×</button></div></article>) : <div className="empty">Услуги не найдены</div>}</div></section></main>
}
export default App
