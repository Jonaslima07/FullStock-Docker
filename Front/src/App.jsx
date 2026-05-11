import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes.jsx"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return(
  <>
  <RouterProvider router={router} />
  <ToastContainer position="top-right" autoClose={5000} />
  </>
)}

export default App;