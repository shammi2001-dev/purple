import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Registration from './pages/Registration/Registration.jsx';
import Login from './pages/Login/Login.jsx'
import firebaseConfig from './authentication/firebaseConfig.jsx';
import { Home } from './pages/Home/Home.jsx';
import store from './store.jsx';
import { Provider } from 'react-redux'


const router = createBrowserRouter([
  {
    path: "/registration",
    element: <Registration/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/",
    element: <Home/>
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store ={store}>
    <RouterProvider router={router} />
    </Provider>
    
  </React.StrictMode>,
)
