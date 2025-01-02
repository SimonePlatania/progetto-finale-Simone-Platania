// // src/api/axios.js
// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://localhost:8080',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     withCredentials: true
// });

// // Interceptor per gestire errori comuni
// api.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response) {
//             // Gestione errori specifici
//             switch (error.response.status) {
//                 case 401:
//                     // Redirect al login se non autenticato
//                     console.log('Sessione scaduta o utente non autenticato');
//                     break;
//                 case 403:
//                     console.log('Non autorizzato');
//                     break;
//                 default:
//                     console.error('Errore nella richiesta:', error.message);
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// // Funzioni di utility per le chiamate API
// export const loginUser = async (credentials) => {
//     const response = await api.post('/api/utenti/login', credentials);
//     return response.data;
// };

// export const getItems = async () => {
//     const response = await api.get('/api/items');
//     return response.data;
// };

// export const createItem = async (itemData, gestoreId) => {
//     const response = await api.post(`/api/items?gestoreId=${gestoreId}`, itemData);
//     return response.data;
// };

// export const getAsteAttive = async () => {
//     const response = await api.get('/api/aste/attive');
//     return response.data;
// };

// export default api;