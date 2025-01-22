import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import InstructorProvider from './components/context.jsx';
import AuthProvider from './components/authContext.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <InstructorProvider>
    <App />
    </InstructorProvider>
    </AuthProvider>
  </StrictMode>
)
