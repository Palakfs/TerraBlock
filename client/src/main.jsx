import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './pages/navbar.jsx'
import Form from './pages/form.jsx'
import Home from './pages/home.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    < App/>
  </StrictMode>,
)
