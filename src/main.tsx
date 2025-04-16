import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ToastContainer} from 'react-toastify';
import './reset.css'

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  </>,
)
