import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Sakura from './Sakura.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sakura />
  </StrictMode>,
)
