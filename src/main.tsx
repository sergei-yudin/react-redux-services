import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { legacy_createStore as createStore } from 'redux'
import App, { reducer } from './App'
import './index.css'
const store = createStore(reducer)
createRoot(document.getElementById('root')!).render(<StrictMode><Provider store={store}><App /></Provider></StrictMode>)
