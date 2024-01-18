import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';
import Login from './Views/Login';
import Home from './Views/Home';
import Register from './Views/Register';
import reportWebVitals from './reportWebVitals';
import User from './Views/User';


export default function App(){
  const token = localStorage.getItem('token');
  
  const element = token && token !== "null" ? <Home /> :  <Login />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={element} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="home" element={<Home />} />
          <Route path="user/:id" element={<User />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
