import React from 'react';
import './App.css';
import './css/bello.css'
import Registra from './components/Registra';
import RegistraGestore from './components/RegistraGestore';
import Login from './components/Login';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Homepage from './components/Homepage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />,
    errorElement: <div>Pagina non trovata</div> 
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/registra",
    element: <Registra />
  },
  {
    path: "registra-gestore", 
    element: <RegistraGestore />
  },
  {
    path: "/homepage",
    element: <Homepage/>
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;