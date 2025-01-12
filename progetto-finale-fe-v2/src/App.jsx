import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Homepage from './components/Homepage';
import AstaDettaglio from './components/AstaDettaglio';
import Login from './components/Login';
import Registra from './components/Registra';
import RegistraGestore from './components/RegistraGestore';
import AsteVinte from './components/AsteVinte';
import AstePartecipate from './components/AstePartecipate';
import GestoreItems from './components/GestoreItems';
import ModificaProfilo from './components/ModificaProfilo';
import ModificaItem from './components/ModificaItem';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />,
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
    path: "/registra-gestore",
    element: <RegistraGestore />
  },
  {
    path: "/modifica/:itemId",
    element: <ModificaItem />
  },
  {
    path: "/modifica-profilo",
    element: <ModificaProfilo/>
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/homepage",
        element: <Homepage />
      },
      {
        path: "/asta/:id",
        element: <AstaDettaglio />
      },
      {
        path: "/aste-vinte",
        element: <AsteVinte/>
      },
      {
        path: "/aste-partecipate",
        element: <AstePartecipate/>
      },
      {
        path: "/items",
        element: <GestoreItems/>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;